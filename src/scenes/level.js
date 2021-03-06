import entities from '../../lib/entities'
import * as screens from '../../assets/screens/screens'
import dungeon from '../../assets/screens/map'
import { width, height } from '../config'
import stage from '../../lib/stage'

let player, map, tiles, mapIndex, dungeonIndex, enteredDoor, enteredDirection
dungeonIndex = { x: 0, y: 5 }

export function loadRoom() {
  mapIndex = dungeon[dungeonIndex.y][dungeonIndex.x]

  let mapData = screens[`screen${mapIndex}`]
  loadMap(mapData)
}

export function loadNewRoom(direction) {
  enteredDirection = direction
  if (direction === 0) {
    dungeonIndex.x += 1
  } else if (direction === 1) {
    dungeonIndex.y += 1
  } else if (direction === 2) {
    dungeonIndex.x -= 1
  } else {
    dungeonIndex.y -= 1
  }
  loadRoom()
  const size = map.tilemap.size * 20
  if (direction === 0) {
    player.transform.x = 12
    player.transform.y = enteredDoor.transform.y
  } else if (direction === 1) {
    player.transform.y = 12
    player.transform.x = enteredDoor.transform.x
  } else if (direction === 2) {
    player.transform.x = size - 12
    player.transform.y = enteredDoor.transform.y
  } else {
    player.transform.x = enteredDoor.transform.x
    player.transform.y = size - 50
  }
}

export function loadMap(mapData) {
  entities.removeAll()

  tiles = []
  map = entities.spawn('map')
  map.tilemap.map = mapData

  mapData.forEach((row, y) => {
    row.forEach((index, x) => {
      let tile
      if (index > 0) {
        tile = entities.spawn('tile')
        tile.transform.x = map.tilemap.size * x
        tile.transform.y = map.tilemap.size * y
        tiles.push(tile)
      }
      if (index === 3) {
        delete tile.collides
        let door = entities.spawn('door')
        door.transform.x = map.tilemap.size * x + 4
        door.transform.y = map.tilemap.size * y + 4
        if (x === row.length - 1) {
          door.direction = 0
          if (enteredDirection === 2) {
            enteredDoor = door
          }
        } else if (y === mapData.length - 1) {
          door.direction = 1
          if (enteredDirection === 3) {
            enteredDoor = door
          }
        } else if (x === 0) {
          if (enteredDirection === 0) {
            enteredDoor = door
          }
          door.direction = 2
        } else {
          if (enteredDirection === 1) {
            enteredDoor = door
          }
          door.direction = 3
        }
      }
    })
  })
  player = entities.spawn('player')

  const tSize = map.tilemap.size
  const pSize = player.sprite.size

  player.unit.minX = pSize / 2
  player.unit.maxX = tSize * mapData[0].length - pSize / 2
  player.unit.maxY = tSize * mapData.length + pSize / 2

  const maxX = mapData[0].length * tSize - width
  const maxY = mapData.length * tSize - height
  stage.setupCamera(player, maxX, maxY)
}


export function start() {
  loadRoom()
}

export function update() {}
