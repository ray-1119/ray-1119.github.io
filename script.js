var key = { "ArrowRight": 0, "ArrowLeft": 0, "ArrowUp": 0, "ArrowDown": 0 };
var moveSystem, x = -2140, y = -1150, speed = 10, movepos = 4, moveannimation, moveannimationclock = 0, keymoving = 0, Generate, entity = 0, attackdamage = 0, playerHP = 100, playerMaxHP = 100, playerMP = 80, playerMaxMP = 80, dataSystem, replySystem, playerXP = 0, playerMaxXP = 10, playerXPlevel = 1, coin = 0, wordsystem, wordbox, dialogboxappear = 0, HPrecoveryInterval = 0, playerSurvivalStatus = 1, pause = 0, attacking = 0, attackAnimationTimer, attackAnimationMove, dialogboxappearEnd = 0, wordtext, backpackopen = 0, inventoryBackpack = [], packbackSelectItemi, SelectEquipment, SelectEquipmentNum, SelectEquipmentID, mainHand = 1, playerAttackDamage = 1, armorValue = 0, attackover;
var skillArr = new Array();
var EquipmentArr = new Array();
var FoodArr = new Array();
const selectElement = get("order");
var select = new Event('select');
var playerEquipmentSystem = { "ArmorHelmet": "", "ArmorChestplate": "", "ArmorLeggings": "", "ArmorBoots": "", "skill": skillArr, "Equipment": EquipmentArr, "Food": FoodArr };
function get(id) {
  return document.getElementById(id);
}
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function keydown(ev) {
  if (playerSurvivalStatus) {
    //ev.preventDefault();
    if (key[ev.key] == 0) {
      key[ev.key] = 1;
      keymoving = 1;
    }
    if (ev.key == " ") {
      if (playerMP - 2 > 0) {
        attack(playerAttackDamage);
        playerMP -= 2;
        HPrecoveryInterval = 3;
      }
    }
    if (ev.key == "e") {
      if (backpackopen == 0) {
        backpack();
        get("backpack").setAttribute("style", "");
        selectElement.dispatchEvent(select);
        backpackopen = 1;
      } else if (backpackopen) {
        get("backpack").setAttribute("style", "display:none");
        get("inventory").remove();
        backpackopen = 0;
        if (mainHand > playerEquipmentSystem["Equipment"].length) {
          playerAttackDamage = 1;
        } else {
          playerAttackDamage = playerEquipmentSystem["Equipment"][mainHand - 1].atk;
        }
        calculateArmorValue();
        get("background").focus();
      }
    }
    if (ev.key == "z") {
      atkChange();
    }
    if (ev.key == "w") {
      if (key["ArrowUp"] == 0) {
        key["ArrowUp"] = 1;
        keymoving = 1;
      }
    }
    if (ev.key == "a") {
      if (key["ArrowLeft"] == 0) {
        key["ArrowLeft"] = 1;
        keymoving = 1;
      }
    }
    if (ev.key == "s") {
      if (key["ArrowDown"] == 0) {
        key["ArrowDown"] = 1;
        keymoving = 1;
      }
    }
    if (ev.key == "d") {
      if (key["ArrowRight"] == 0) {
        key["ArrowRight"] = 1;
        keymoving = 1;
      }
    }
  }
}
function calculateArmorValue() {
  armorValue = 0;
  if (playerEquipmentSystem["ArmorHelmet"] != "") {
    armorValue += playerEquipmentSystem["ArmorHelmet"].armor;
  }
  if (playerEquipmentSystem["ArmorChestplate"] != "") {
    armorValue += playerEquipmentSystem["ArmorChestplate"].armor;
  }
  if (playerEquipmentSystem["ArmorLeggings"] != "") {
    armorValue += playerEquipmentSystem["ArmorLeggings"].armor;
  }
  if (playerEquipmentSystem["ArmorBoots"] != "") {
    armorValue += playerEquipmentSystem["ArmorBoots"].armor;
  }
}
function calculateHarm(armor, harm) {
  var reduction = 0;
  if (armor == 0) return harm;
  if (armor >= 20) {
    reduction = 0.95;
  } else if (armor > 0) {
    reduction = (armor / 20) * 0.95;
  }
  if (harm > 20 && harm < 800) {
    reduction *= (1 - ((harm - 20) / 780) * 0.4);
  } else if (harm >= 800) {
    reduction *= 0.6;
  }
  return harm * (1 - reduction);
}
function atkChange() {
  if (mainHand == 1) {
    mainHand = 2;
    if (mainHand > playerEquipmentSystem["Equipment"].length) {
      playerAttackDamage = 1;
    } else {
      playerAttackDamage = playerEquipmentSystem["Equipment"][mainHand - 1].atk;
    }
  } else if (mainHand == 2) {
    mainHand = 1;
    if (mainHand > playerEquipmentSystem["Equipment"].length) {
      playerAttackDamage = 1;
    } else {
      playerAttackDamage = playerEquipmentSystem["Equipment"][mainHand - 1].atk;
    }
  }
}
function keyup(ev) {
  if (key[ev.key] == 1) {
    key[ev.key] = 0;
    keymoving = 0;
  }
  if (ev.key == "w") {
    if (key["ArrowUp"] == 1) {
      key["ArrowUp"] = 0;
      keymoving = 0;
    }
  }
  if (ev.key == "a") {
    if (key["ArrowLeft"] == 1) {
      key["ArrowLeft"] = 0;
      keymoving = 0;
    }
  }
  if (ev.key == "s") {
    if (key["ArrowDown"] == 1) {
      key["ArrowDown"] = 0;
      keymoving = 0;
    }
  }
  if (ev.key == "d") {
    if (key["ArrowRight"] == 1) {
      key["ArrowRight"] = 0;
      keymoving = 0;
    }
  }
}
function move() {
  if (key["ArrowRight"]) {
    if (x - speed > -2140) {
      movepos = 1;
      x -= speed;
      keymoving = 1;
    } else {
      movepos = 1;
      x = -2140;
      keymoving = 1;
    }
  } else if (key["ArrowLeft"]) {
    if (x + speed < 706) {
      movepos = 2;
      x += speed;
      keymoving = 1;
    } else {
      movepos = 2;
      x = 706;
      keymoving = 1;
    }
  } else if (key["ArrowUp"]) {
    if (y + speed < 400) {
      movepos = 3;
      y += speed;
      keymoving = 1;
    } else {
      movepos = 3;
      y = 400;
      keymoving = 1;
    }
  } else if (key["ArrowDown"]) {
    if (y - speed > -2432) {
      movepos = 4;
      y -= speed;
      keymoving = 1;
    } else {
      movepos = 4;
      y = -2432;
      keymoving = 1;
    }

  }
  get("background").style.backgroundPositionX = x + "px";
  get("background").style.backgroundPositionY = y + "px";
}
function walk() {
  if (attacking == 0) {
    if (movepos == 1) {
      get("player").style.backgroundPositionY = "-96px";
    } else if (movepos == 2) {
      get("player").style.backgroundPositionY = "-48px";
    } else if (movepos == 3) {
      get("player").style.backgroundPositionY = "-144px";
    } else if (movepos == 4) {
      get("player").style.backgroundPositionY = "0px";
    }
    if (moveannimationclock < 96) {
      moveannimationclock += 48;
    } else if (moveannimationclock == 96) {
      moveannimationclock = 0;
    }
    if (keymoving) {
      get("player").style.backgroundPositionX = "-" + moveannimationclock + "px";
    }
  }
}
function data() {
  get("HPbar").innerHTML = "HP:" + Math.round(playerHP) + "/" + playerMaxHP;
  get("MPbar").innerHTML = "MP:" + Math.round(playerMP) + "/" + playerMaxMP;
  get("HPbar").style.width = ((playerHP / playerMaxHP) * 400) + "px";
  get("MPbar").style.width = ((playerMP / playerMaxMP) * 300) + "px";
  get("XPlevel").innerHTML = playerXPlevel;
  get("XPbar").innerHTML = "XP:" + Math.round(playerXP) + "/" + playerMaxXP;
  get("XPbar").style.width = ((playerXP / playerMaxXP) * 200) + "px";
  get("coin").innerHTML = coin;
  if (playerXP >= playerMaxXP) {
    playerXP -= playerMaxXP;
    playerXPlevel++;
    if (playerXPlevel <= 100) {
      playerMaxXP += (1 + Math.floor(playerXPlevel / 10)) * 10;
    } else if (playerXPlevel <= 200) {
      playerMaxXP += (1 + Math.floor(playerXPlevel / 10)) * 20;
    } else if (playerXPlevel <= 300) {
      playerMaxXP += (1 + Math.floor(playerXPlevel / 10)) * 50;
    } else if (playerXPlevel <= 400) {
      playerMaxXP += (1 + Math.floor(playerXPlevel / 10)) * 100;
    } else {
      playerMaxXP += (1 + Math.floor(playerXPlevel / 10)) * 200;
    }
  }
  if (playerXPlevel >= 100) {
    get("XPlevel").style.fontSize = "20pt";
  }
  if (playerHP <= 0) {
    die();
  }
}
function die() {
  playerSurvivalStatus = 0;
  get("player").style.backgroundImage = `url(${"player1attack.png"})`;
  get("player").style.backgroundPositionX = "-288px";
  get("player").style.backgroundPositionY = "-240px";
  talk("你死亡了!", 1000);
  clearInterval(moveSystem);
  clearInterval(moveannimation);
  clearInterval(replySystem);
  clearInterval(Generate);
  clearInterval(dataSystem);
  clearInterval(attackover);
  key["ArrowRight"] = 0;
  key["ArrowLeft"] = 0;
  key["ArrowUp"] = 0;
  key["ArrowDown"] = 0;
  keymoving = 0;
  entity = 0;
  var reborn = document.createElement("div");
  reborn.id = "rebornButton";
  reborn.addEventListener("click", rebornSystem);
  get("background").appendChild(reborn);
  get("rebornButton").innerHTML = "重生";
  if (backpackopen) {
    get("backpack").setAttribute("style", "display:none");
    get("inventory").remove();
    backpackopen = 0;
  }
}
function rebornSystem() {
  playerHP = playerMaxHP;
  playerMP = playerMaxMP;
  moveSystem = setInterval(move, 20);
  moveannimation = setInterval(walk, 100);
  replySystem = setInterval(reply, 250);
  Generate = setInterval(monsterGenerate, 2000);
  dataSystem = setInterval(data, 20);
  get("rebornButton").remove();
  x = -2140;
  y = -1150;
  get("background").style.backgroundPositionX = x + "px";
  get("background").style.backgroundPositionY = y + "px";
  key["ArrowRight"] = 0;
  key["ArrowLeft"] = 0;
  key["ArrowUp"] = 0;
  key["ArrowDown"] = 0;
  keymoving = 0;
  get("player").style.backgroundImage = `url(${"player.png"})`;
  get("player").style.backgroundPositionX = "0px";
  get("player").style.backgroundPositionY = "0px";
  playerSurvivalStatus = 1;
}
function reply() {
  if (playerHP > 0) {
    if (HPrecoveryInterval <= 0) {
      if (playerHP + 1 < playerMaxHP) {
        playerHP += 1;
      } else {
        playerHP = playerMaxHP;
      }
    }
    if (playerMP + 1 < playerMaxMP) {
      playerMP += 1;
    } else {
      playerMP = playerMaxMP;
    }
    if (HPrecoveryInterval > 0) {
      HPrecoveryInterval -= 0.25;
    }
  }
}
function goToAttackover() {
  attackdamage = 0;
}
function init() {
  talk("首先，因為時間問題，遊戲尚未完成，所以教學就先這樣子用文字教學，w和向上鍵:向上移動，a和向左鍵:向左移動，s和下上鍵 : 向下移動，d和向右鍵:向右移動，空白鍵:攻擊，e:開啟背包，z:切換武器，x:使用第1項技能，c:使用第2項技能，v:使用第3項技能，因為抽獎系統還沒做好所以有在背包放一點裝備和武器和技能(但很多東西還沒做好可能怪怪的)，點擊裝備和武器和技能可以穿上，技能沒有用我還沒做所以就不用理，現在場上會有小怪，也只有1種，可以去打，會掉錢(錢還沒有用)，然後就沒了，其他東西之後會做(可能而已)，可以把連結記起來之後玩，喔對了還有你會飛(右下角有三角形可以關掉這個對話框，如果你還沒學會操作，先不要關掉)",10000)
  get("background").focus();
  get("loding").remove();
  moveSystem = setInterval(move, 20);
  moveannimation = setInterval(walk, 100);
  dataSystem = setInterval(data, 20);
  replySystem = setInterval(reply, 250);
  Generate = setInterval(monsterGenerate, 2000);
  selectElement.addEventListener("change", function() {
    selectElement.dispatchEvent(select);
  });
  selectElement.addEventListener("select", function() {
    if (selectElement.value == "名稱:A~Z") {
      inventoryBackpack.sort((a, b) => a.name.localeCompare(b.name));
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "名稱:Z~A") {
      inventoryBackpack.sort((a, b) => b.name.localeCompare(a.name));
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "獲得時間:新~舊") {
      inventoryBackpack.sort((a, b) => b.timeObtained - a.timeObtained);
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "獲得時間:舊~新") {
      inventoryBackpack.sort((a, b) => a.timeObtained - b.timeObtained);
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "裝備等級:高~低") {
      inventoryBackpack.sort((a, b) => b.level - a.level);
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "裝備等級:低~高") {
      inventoryBackpack.sort((a, b) => a.level - b.level);
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "裝備星數:高~低") {
      inventoryBackpack.sort((a, b) => b.star - a.star);
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "裝備星數:低~高") {
      inventoryBackpack.sort((a, b) => a.star - b.star);
      get("inventory").remove();
      backpack();
    } else if (selectElement.value == "裝備型態:種類") {
      inventoryBackpack.sort((a, b) => a.type.localeCompare(b.type));
      get("inventory").remove();
      backpack();
    }
  });
}
function attack(damage) {
  attackdamage = damage;
  if (attackdamage > 0) {
    clearTimeout(attackover);
  }
  attackover = setTimeout(goToAttackover, 100);
  get("player").style.backgroundImage = `url(${"player1attack.png"})`;
  attackAnimationMove = 0;
  get("player").style.backgroundPositionX = attackAnimationMove + "px";
  get("player").style.backgroundPositionY = "0px";
  if (attacking == 0) {
    attacking = 1;
    attackAnimationTimer = setInterval(attackAnimation, 100);
  }
}
function attackAnimation() {
  get("player").style.backgroundPositionX = attackAnimationMove + "px";
  if (attackAnimationMove >= 384) {
    attacking = 0;
    get("player").style.backgroundImage = `url(${"player.png"})`;
    get("player").style.backgroundPositionX = "0px";
    clearInterval(attackAnimationTimer);
  }
  if (playerSurvivalStatus == 0) {
    attacking = 0;
    clearInterval(attackAnimationTimer);
  }
  attackAnimationMove += 48;
}
function monsterGenerate() {
  if (entity > 50) return;
  var GenerateX, GenerateY;
  if (random(0, 1)) {
    if (random(0, 1)) {
      if (x + 700 > 706) {
        GenerateX = random(x - 700, -2140);
      } else {
        GenerateX = random(x + 700, 706);
      }
    } else {
      if (x - 700 < -2140) {
        GenerateX = random(x + 700, 706);
      } else {
        GenerateX = random(x - 700, -2140);
      }
    }
    GenerateY = random(-2432, 400);
  } else {
    if (random(0, 1)) {
      if (y + 400 > 400) {
        GenerateY = random(y - 400, -2432);
      } else {
        GenerateY = random(y + 400, 400);
      }
    } else {
      if (y - 400 < -2432) {
        GenerateY = random(y + 400, 400);
      } else {
        GenerateY = random(y - 400, -2432);
      }
    }
    GenerateX = random(-2140, 706);
  }
  entity += 1;
  var mon = document.createElement("div");
  mon.className = "monster";
  mon.style.top = (400 - (GenerateY - y)) + "px";
  mon.style.left = (700 - (GenerateX - x)) + "px";
  mon.style.display = 'none';
  mon.monsterHP = 10;
  mon.monsterATK = 1;
  mon.GenX = GenerateX;
  mon.GenY = GenerateY;
  mon.tm = setInterval(monstermove, 65, mon);
  get("background").appendChild(mon);
}
function monstermove(mon) {
  if (400 - (mon.GenY - y) > 800 || 400 - (mon.GenY - y) < 0 || 700 - (mon.GenX - x) > 1400 || 700 - (mon.GenX - x) < 0) {
    mon.style.display = 'none';
    mon.GenX += random(-10, 10);
    mon.GenY += random(-10, 10);
  } else {
    mon.style.display = '';
    if (mon.GenX > x) {
      mon.GenX -= random(1, 10);
    } else if (mon.GenX < x) {
      mon.GenX += random(1, 10);
    }
    if (mon.GenY > y) {
      mon.GenY -= random(1, 10);
    } else if (mon.GenY < y) {
      mon.GenY += random(1, 10);
    }
    mon.style.top = (400 - (mon.GenY - y)) + "px";
    mon.style.left = (700 - (mon.GenX - x)) + "px";
  }
  if (Math.abs((400 - (mon.GenY - y)) - 400) < 30 && Math.abs((700 - (mon.GenX - x)) - 700) < 30) {
    if (playerHP > 0) {
      playerHP -= calculateHarm(armorValue, mon.monsterATK);
      if (HPrecoveryInterval <= 2) {
        HPrecoveryInterval = 2;
      }
    }
  }
  if (Math.abs((400 - (mon.GenY - y)) - 400) < 35 && Math.abs((700 - (mon.GenX - x)) - 700) < 35) {
    if (attackdamage > 0) {
      mon.monsterHP -= attackdamage;
      if (mon.monsterHP <= 0) {
        clearInterval(mon.tm);
        entity -= 1;
        playerXP += 2;
        coin += 5;
        mon.remove();
      }
    }
  }
  if (playerHP <= 0) {
    clearInterval(mon.tm);
    entity -= 1;
    mon.remove();
  }
}
function talk(word, time) {
  wordtext = word;
  if (dialogboxappear == 0) {
    var talkbox = document.createElement("div");
    talkbox.id = "dialogbox";
    talkbox.className = "overflow-auto";
    talkbox.addEventListener("click", talkfast);
    get("background").appendChild(talkbox);
  }
  if (dialogboxappear) {
    clearInterval(wordbox);
  }
  wordsystem = 1;
  if (dialogboxappearEnd) {
    dialogboxappearEnd = 0;
    get("dialogboxEnd").remove();
  }
  wordbox = setInterval(printword, time / word.length, word);
  dialogboxappear = 1;
}
function talkfast() {
  if (dialogboxappearEnd == 0) {
    get("dialogbox").innerHTML = wordtext;
    clearInterval(wordbox);
    var talkboxEnd = document.createElement("div");
    talkboxEnd.id = "dialogboxEnd";
    get("background").appendChild(talkboxEnd);
    talkboxEnd.addEventListener("click", talkboxover);
    dialogboxappearEnd = 1;
  }
}
function printword(word) {
  get("dialogbox").innerHTML = word.substr(0, wordsystem);
  if (wordsystem <= word.length - 1) {
    wordsystem++;
  } else {
    if (dialogboxappearEnd == 0) {
      var talkboxEnd = document.createElement("div");
      talkboxEnd.id = "dialogboxEnd";
      get("background").appendChild(talkboxEnd);
      talkboxEnd.addEventListener("click", talkboxover);
      dialogboxappearEnd = 1;
    }
    clearInterval(wordbox);
  }
}
function talkboxover() {
  dialogboxappear = 0;
  dialogboxappearEnd = 0;
  get("dialogbox").remove();
  get("dialogboxEnd").remove();
}
function backpack() {
  get("packbackSelectItem").style.backgroundImage = `url(${""})`;
  get("packbackSelectItemName").innerHTML = "";
  get("packbackSelectItemIntroduction").innerHTML = "";
  get("packbackSelectItemDressup").innerHTML = ""
  get("packbackSelectItemData").innerHTML = "";
  packbackSelectItemi = "";
  SelectEquipment = "";
  SelectEquipmentNum = "";
  SelectEquipmentID = "";
  var inventory = document.createElement("div");
  inventory.id = "inventory";
  inventory.className = "overflow-auto";
  inventory.style = "display:flex; flex-wrap:wrap; align-content:flex-start;";
  get("backpack").appendChild(inventory);
  for (i = 0; i < inventoryBackpack.length; i++) {
    var inventory_ = document.createElement("span");
    inventory_.id = "inventory_" + i;
    inventory_.className = "inventory_";
    inventory_.i = i;
    inventory_.addEventListener("click", clickInventory, inventory_);
    get("inventory").appendChild(inventory_);
    get("inventory_" + i).style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[i].img + ".png"})`;
  }
}
function clickInventory(inventoryData) {
  get("packbackSelectItemDressup").innerHTML = "裝備";
  packbackSelectItemi = inventoryData.target.i;
  get("packbackSelectItem").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[inventoryData.target.i].img + ".png"})`;
  get("packbackSelectItemName").innerHTML = inventoryBackpack[inventoryData.target.i].name;
  get("packbackSelectItemIntroduction").innerHTML = inventoryBackpack[inventoryData.target.i].info;
  get("packbackSelectItemData").innerHTML = "星數:" + inventoryBackpack[inventoryData.target.i].star +"<br>等級:" + inventoryBackpack[inventoryData.target.i].level + "<br>攻擊力:" + inventoryBackpack[inventoryData.target.i].atk + "<br>防禦力:" + inventoryBackpack[inventoryData.target.i].armor;
}
function check(type, id, num) {
  if (playerEquipmentSystem[type] != "") {
    if (type == "ArmorHelmet" || type == "ArmorChestplate" || type == "ArmorLeggings" || type == "ArmorBoots") {
      get("packbackSelectItemDressup").innerHTML = "卸下";
      SelectEquipment = type;
      SelectEquipmentID = id;
      get("packbackSelectItem").style.backgroundImage = `url(${"equipmentSystem/" + playerEquipmentSystem[type].img + ".png"})`;
      get("packbackSelectItemName").innerHTML = playerEquipmentSystem[type].name;
      get("packbackSelectItemIntroduction").innerHTML = playerEquipmentSystem[type].info;
      get("packbackSelectItemData").innerHTML = "星數:" + playerEquipmentSystem[type].star +"<br>等級:" + playerEquipmentSystem[type].level + "<br>攻擊力:" + playerEquipmentSystem[type].atk + "<br>防禦力:" + playerEquipmentSystem[type].armor;
    } else if (type == "Food") {
      get("packbackSelectItem").style.backgroundImage = `url(${"playerEquipmentSystem[type][9999]"})`;
      get("packbackSelectItemDressup").innerHTML = playerEquipmentSystem[type][9999];
      get("packbackSelectItemName").innerHTML = playerEquipmentSystem[type][9999];
      get("packbackSelectItemIntroduction").innerHTML = playerEquipmentSystem[type][9999];
      get("packbackSelectItemData").innerHTML = playerEquipmentSystem[type][9999];
    } else {
      if (num > playerEquipmentSystem[type].length) return;
      get("packbackSelectItemDressup").innerHTML = "卸下";
      SelectEquipment = type;
      SelectEquipmentID = id;
      SelectEquipmentNum = num;
      get("packbackSelectItem").style.backgroundImage = `url(${"equipmentSystem/" + playerEquipmentSystem[type][num - 1].img + ".png"})`;
      get("packbackSelectItemName").innerHTML = playerEquipmentSystem[type][num - 1].name;
      get("packbackSelectItemIntroduction").innerHTML = playerEquipmentSystem[type][num - 1].info;
      get("packbackSelectItemData").innerHTML = "星數:" + playerEquipmentSystem[type][num - 1].star +"<br>等級:" + playerEquipmentSystem[type][num - 1].level + "<br>攻擊力:" + playerEquipmentSystem[type][num - 1].atk + "<br>防禦力:" + playerEquipmentSystem[type][num - 1].armor;
    }
  }
}
class weapon {
  constructor(name, type, info, star, img, level, timeObtained, atk, armor) {
    this.name = name;
    this.type = type;
    this.info = info;
    this.star = star;
    this.img = img;
    this.level = level;
    this.timeObtained = timeObtained;
    this.atk = atk;
    this.armor = armor;
  }
}
var ns = new weapon('新手技能', 'ae', '給新手用的技能，可以發射火球(開發中)', 88, '0007', 50, 1, 12, 0)
inventoryBackpack.push(ns)
inventoryBackpack.push(ns)
inventoryBackpack.push(ns)
inventoryBackpack.push(ns)
var nw = new weapon('新手武器', 'af', '給新手使用的武器', 1, "0000", 66, 2, 5, 0)
inventoryBackpack.push(nw)
inventoryBackpack.push(nw)
inventoryBackpack.push(nw)
var nw = new weapon('新手裝備', 'aa', '給新手使用的裝備', 1, "0001", 80, 3, 0, 1)
inventoryBackpack.push(nw)
inventoryBackpack.push(nw)
var nw = new weapon('新手裝備', 'ab', '給新手使用的裝備', 1, "0002", 27, 4, 0, 2)
inventoryBackpack.push(nw)
inventoryBackpack.push(nw)
var nw = new weapon('新手裝備', 'ac', '給新手使用的裝備', 1, "0003", 44, 5, 0, 1)
inventoryBackpack.push(nw)
inventoryBackpack.push(nw)
var nw = new weapon('新手裝備', 'ad', '給新手使用的裝備', 1, "0004", 99, 6, 0, 1)
inventoryBackpack.push(nw)
inventoryBackpack.push(nw)
var nw = new weapon('聖劍', 'af', '給大師使用的武器，可附帶5秒燃燒效果(開發中)', 5, "0005", 120, 6, 8, 0)
inventoryBackpack.push(nw)
var nw = new weapon('聖者之]書', 'ae', '不知道要講什麼(開發中)', 5, "0006", 999, 12, 0, 0)
inventoryBackpack.push(nw)
var nw = new weapon('vu04294j3fu4', 'af', 'm03t/6j3fu4(開發中)', 5, "0008", 99999999999, 12, 0, 0)
inventoryBackpack.push(nw)
var nw = new weapon('治療法書', 'ag', '給大師使用的武器，可附帶5秒燃燒效果(開發中)', 5, "0010", 120, 6, 8, 0)
inventoryBackpack.push(nw)
var nw = new weapon('治療法書弓箭', 'af', '給大師使用的武器，可附帶5秒燃燒效果(開發中)', 5, "0009", 120, 6, 8, 0)
inventoryBackpack.push(nw)
var nw = new weapon('神秘寶箱(開發中)', 'af', '給大師使用的武器，可附帶5秒燃燒效果(開發中)', 5, "0011", 120, 6, 8, 0)
inventoryBackpack.push(nw)
function ItemDressup() {
  if (get("packbackSelectItemDressup").innerHTML == "裝備") {
    if (packbackSelectItemi.length != 0) {
      if (inventoryBackpack[packbackSelectItemi].type == "aa") {
        if (playerEquipmentSystem["ArmorHelmet"] == "") {
          playerEquipmentSystem["ArmorHelmet"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorHelmet").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        } else {
          inventoryBackpack.push(playerEquipmentSystem["ArmorHelmet"]);
          playerEquipmentSystem["ArmorHelmet"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorHelmet").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      } else if (inventoryBackpack[packbackSelectItemi].type == "ab") {
        if (playerEquipmentSystem["ArmorChestplate"] == "") {
          playerEquipmentSystem["ArmorChestplate"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorChestplate").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        } else {
          inventoryBackpack.push(playerEquipmentSystem["ArmorChestplate"]);
          playerEquipmentSystem["ArmorChestplate"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorChestplate").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      } else if (inventoryBackpack[packbackSelectItemi].type == "ac") {
        if (playerEquipmentSystem["ArmorLeggings"] == "") {
          playerEquipmentSystem["ArmorLeggings"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorLeggings").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        } else {
          inventoryBackpack.push(playerEquipmentSystem["ArmorLeggings"]);
          playerEquipmentSystem["ArmorLeggings"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorLeggings").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      } else if (inventoryBackpack[packbackSelectItemi].type == "ad") {
        if (playerEquipmentSystem["ArmorBoots"] == "") {
          playerEquipmentSystem["ArmorBoots"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorBoots").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        } else {
          inventoryBackpack.push(playerEquipmentSystem["ArmorBoots"]);
          playerEquipmentSystem["ArmorBoots"] = inventoryBackpack[packbackSelectItemi];
          get("packbackArmorBoots").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      } else if (inventoryBackpack[packbackSelectItemi].type == "ae") {
        if (playerEquipmentSystem.skill.length < 3) {
          playerEquipmentSystem.skill.push(inventoryBackpack[packbackSelectItemi]);
          get("packbackPlayerSkill" + (playerEquipmentSystem.skill.length)).style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      } else if (inventoryBackpack[packbackSelectItemi].type == "af") {
        if (playerEquipmentSystem.Equipment.length < 2) {
          playerEquipmentSystem.Equipment.push(inventoryBackpack[packbackSelectItemi]);
          get("packbackPlayerWeapon" + (playerEquipmentSystem.Equipment.length)).style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      } else if (inventoryBackpack[packbackSelectItemi].type == "ag") {
        if (playerEquipmentSystem.Food.length < 10) {
          playerEquipmentSystem.Food.push(inventoryBackpack[packbackSelectItemi]);
          get("packbackPlayerFood").style.backgroundImage = `url(${"equipmentSystem/" + inventoryBackpack[packbackSelectItemi].img + ".png"})`;
          inventoryBackpack.splice(packbackSelectItemi, 1);
        }
      }
    }
  } else if (get("packbackSelectItemDressup").innerHTML == "卸下") {
    if (SelectEquipment != "") {
      if (SelectEquipmentNum == "") {
        get(SelectEquipmentID).style.backgroundImage = `url(${SelectEquipmentID + ".png"})`;
        inventoryBackpack.push(playerEquipmentSystem[SelectEquipment]);
        playerEquipmentSystem[SelectEquipment] = "";
      } else {
        if (SelectEquipment == "skill") {
          for (var i = 1; i <= 3; i++) {
            get(SelectEquipmentID.substr(0, SelectEquipmentID.length - 1) + i).style.backgroundImage = `url(${SelectEquipmentID.substr(0, SelectEquipmentID.length - 1) + ".png"})`;
          }
          inventoryBackpack.push(playerEquipmentSystem[SelectEquipment][SelectEquipmentNum - 1]);
          playerEquipmentSystem[SelectEquipment].splice(SelectEquipmentNum - 1, 1);
          for (var i = 1; i <= playerEquipmentSystem[SelectEquipment].length; i++) {
            get(SelectEquipmentID.substr(0, SelectEquipmentID.length - 1) + i).style.backgroundImage = `url(${"equipmentSystem/" + playerEquipmentSystem[SelectEquipment][i - 1].img + ".png"})`;
          }
        } else if (SelectEquipment == "Equipment") {
          for (var i = 1; i <= 2; i++) {
            get(SelectEquipmentID.substr(0, SelectEquipmentID.length - 1) + i).style.backgroundImage = `url(${SelectEquipmentID.substr(0, SelectEquipmentID.length - 1) + ".png"})`;
          }
          inventoryBackpack.push(playerEquipmentSystem[SelectEquipment][SelectEquipmentNum - 1]);
          playerEquipmentSystem[SelectEquipment].splice(SelectEquipmentNum - 1, 1);
          for (var i = 1; i <= playerEquipmentSystem[SelectEquipment].length; i++) {
            get(SelectEquipmentID.substr(0, SelectEquipmentID.length - 1) + i).style.backgroundImage = `url(${"equipmentSystem/" + playerEquipmentSystem[SelectEquipment][i - 1].img + ".png"})`;
          }
        }
      }
    }
  }
  selectElement.dispatchEvent(select);
}
function openBox(num) {
  if (num == 1) {
    var boxItem;
    var probability = random(1,1000);
    var star;
    if(probability >= 1 && probability <= 650){
      star = 1;
    }else if(probability >= 651 && probability <= 900){
      star = 2;
    }else if(probability >= 901 && probability <= 965){
      star = 3;
    }else if(probability >= 966 && probability <= 999){
      star = 4;
    }else if(probability == 1000){
      star = 5;
    }
  } else if (num == 10) {
    
  }
}
function shop() {
  
}