const Vec3 = require('vec3')
const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: process.argv[2],
  username: process.argv[3]   
})

let mcData
bot.on('inject_allowed', () => {
  mcData = require('minecraft-data')(bot.version)
})

//cutting = True
//loop,if (cutting), find nearest log, break it
//loop,if (log exist in bot.entities), 
//cutting = False, go to that entity
//on player self collect, cutting = True

// Load collect block
bot.loadPlugin(require('mineflayer-collectblock').plugin)

var cutting = false
//once spawn cutting=True
function cutTrees() {
	//still cutting
	if(cutting) {
		return;
	}

	// Find a nearby grass block
	const log = bot.findBlock({
		matching: mcData.blocksByName.oak_log.id,
		maxDistance: 64
	})

	if (log) {
		// If we found one, collect it.
		bot.collectBlock.collect(log, err => {
		  if (err) // Handle errors, if any
		    console.log(err)
		  else
		    //collectGrass() // Collect another log
			cutting = false
		})
	}
	cutting = true;
}




// On spawn, start collecting all nearby log
bot.once('spawn', function(){
	//cutTrees();
	setInterval(cutTrees,500);
})
//interactive message
bot.on('message',(cm) =>{
  console.log(cm.toString())
})

function message(text){
  bot.chat(text)
}

var repl = require("repl");
var r = repl.start("");
r.context.message = message;
////