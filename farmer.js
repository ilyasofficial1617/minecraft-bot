const Vec3 = require('vec3')
const mineflayer = require('mineflayer')

const bot = mineflayer.createBot({
  host: process.argv[2],
  port: parseInt(process.argv[3]),
  username: process.argv[4]   
})

let mcData
bot.on('inject_allowed', () => {
  mcData = require('minecraft-data')(bot.version)
})

// To fish we have to give bot the seeds
// /give farmer wheat_seeds 64

function blockToSow () {
  return bot.findBlock({
    point: bot.entity.position,
    matching: (block) => {
      if (block && block.type === mcData.blocksByName.farmland.id) {
        const blockAbove = bot.blockAt(block.position.offset(0, 1, 0))
        console.log(block)
        return !blockAbove || blockAbove.type === 0
      }

      return false
    }
  })
}

function blockToHarvest () {
  return bot.findBlock({
    point: bot.entity.position,
    matching: (block) => {
      return block && block.type === mcData.blocksByName.wheat.id && block.metadata === 7
    }
  })
}

function loop () {
  try {
    const toHarvest = blockToHarvest()
    if (toHarvest) {
      return bot.dig(toHarvest, () => {
        return setImmediate(loop)
      })
    }

    /*
    const toSow = blockToSow()
    if (toSow) {
      return bot.equip(mcData.itemsByName.wheat_seeds.id, 'hand', () => {
        bot.placeBlock(toSow, new Vec3(0, 1, 0), () => {
          setImmediate(loop)
        })
      })
    }*/
    setImmediate(loop)
  } catch (e) {
    console.log(e)
  }

  // None blocks to harvest or sow. Postpone next loop a bit
  setTimeout(loop, 1000)
}

bot.once('login', loop)