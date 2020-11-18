const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: process.argv[2],
  username: process.argv[3],
})

let mcData
bot.on('inject_allowed', () => {
  mcData = require('minecraft-data')(bot.version)
})

let nowFishing = false

let fishingCount = 0

function onCollect (player, entity) {
  if (entity.kind === 'Drops' && player === bot.entity) {
    bot.removeListener('playerCollect', onCollect)
    startFishing()
    fishingCount++;
    //setTimeout(startFishing, 1000);
  }
}

function startFishing () {
  console.log("fishing..#"+fishingCount)
  //bot.chat('Fishing')
  bot.equip(mcData.itemsByName.fishing_rod.id, 'hand', (err) => {
    if (err) {
      //return bot.chat(err.message)
      console.log(err.message)
      bot.quit("")
    }

    nowFishing = true
    bot.on('playerCollect', onCollect)

    bot.fish((err) => {
      nowFishing = false
      
      if (err) {
        //bot.chat(err.message)
        console.log(err.message)
      }
    })
  })
}

function stopFishing () {
  bot.removeListener('playerCollect', onCollect)

  if (nowFishing) {
    bot.activateItem()
  }
}

bot.once('spawn', function(){
  startFishing();
})

bot.on('message',(cm) =>{
  console.log(cm.toString())
})

function message(text){
  bot.chat(text)
}

var repl = require("repl");
var r = repl.start("");
r.context.message = message;