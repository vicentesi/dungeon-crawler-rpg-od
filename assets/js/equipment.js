const createEquipment = () => {
    const equipment = {
        category: null,
        attribute: null,
        type: null,
        rarity: null,
        lvl: null,
        value: null,
        stats: [],
    };

    // Generate random equipment attribute
    const equipmentAttributes = ["Damage", "Defense"];
    equipment.attribute = equipmentAttributes[Math.floor(Math.random() * equipmentAttributes.length)];

    // Generate random equipment name and type based on attribute
    if (equipment.attribute == "Damage") {
        const equipmentCategories = ["Sword", "Axe", "Hammer", "Dagger", "Flail", "Scythe"];
        equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        equipment.type = "Weapon";
    } else if (equipment.attribute == "Defense") {
        const equipmentTypes = ["Armor", "Shield", "Helmet"];
        equipment.type = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
        if (equipment.type == "Armor") {
            const equipmentCategories = ["Plate", "Chain", "Leather"];
            equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        } else if (equipment.type == "Shield") {
            const equipmentCategories = ["Tower", "Kite", "Buckler"];
            equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        } else if (equipment.type == "Helmet") {
            const equipmentCategories = ["Great Helm", "Horned Helm"];
            equipment.category = equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)];
        }
    }

    // Generate random equipment rarity
    const rarityChances = {
        "Common": 0.7,
        "Uncommon": 0.2,
        "Rare": 0.04,
        "Epic": 0.03,
        "Legendary": 0.02,
        "Heirloom": 0.01
    };

    const randomNumber = Math.random();
    let cumulativeChance = 0;

    for (let rarity in rarityChances) {
        cumulativeChance += rarityChances[rarity];
        if (randomNumber <= cumulativeChance) {
            equipment.rarity = rarity;
            break;
        }
    }

    // Determine number of times to loop based on equipment rarity
    let loopCount;
    switch (equipment.rarity) {
        case "Common":
            loopCount = 2;
            break;
        case "Uncommon":
            loopCount = 3;
            break;
        case "Rare":
            loopCount = 4;
            break;
        case "Epic":
            loopCount = 5;
            break;
        case "Legendary":
            loopCount = 6;
            break;
        case "Heirloom":
            loopCount = 8;
            break;
    }

    // Generate and append random stats to the stats array
    const physicalStats = ["atk", "atkSpd", "vamp", "critRate", "critDmg"];
    const damageyStats = ["atk", "atk", "critRate", "critDmg", "critDmg"];
    const speedyStats = ["atkSpd", "atkSpd", "vamp", "critRate", "critDmg"];
    const defenseStats = ["hp", "hp", "def", "def", "atk"];
    const dmgDefStats = ["hp", "def", "atk", "atk", "critRate", "critDmg"];
    let statTypes;
    if (equipment.attribute == "Damage") {
        if (equipment.category == "Axe" || equipment.category == "Scythe") {
            statTypes = damageyStats;
        } else if (equipment.category == "Dagger" || equipment.category == "Flail") {
            statTypes = speedyStats;
        } else if (equipment.category == "Hammer") {
            statTypes = dmgDefStats;
        } else {
            statTypes = physicalStats;
        }
    } else if (equipment.attribute == "Defense") {
        statTypes = defenseStats;
    }
    let equipmentValue = 0;
    for (let i = 0; i < loopCount; i++) {
        let statType = statTypes[Math.floor(Math.random() * statTypes.length)];

        // Stat scaling for equipment
        const maxLvl = dungeon.progress.floor * dungeon.settings.enemyLvlGap + (dungeon.settings.enemyBaseLvl - 1);
        const minLvl = maxLvl - (dungeon.settings.enemyLvlGap - 1);
        equipment.lvl = randomizeNum(minLvl, maxLvl);
        let statMultiplier = (dungeon.settings.enemyScaling - 1) * equipment.lvl;
        let hpScaling = (25 * randomizeDecimal(0.5, 1.5)) + ((25 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let atkDefScaling = (10 * randomizeDecimal(0.5, 1.5)) + ((6 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let cdAtkSpdScaling = (3 * randomizeDecimal(0.5, 1.5)) + ((3 * randomizeDecimal(0.5, 1.5)) * statMultiplier);
        let crVampScaling = (1.2 * randomizeDecimal(0.5, 1.5)) + ((1.2 * randomizeDecimal(0.5, 1.5)) * statMultiplier);

        // Set randomized numbers to respective stats and increment sell value
        if (statType === "hp") {
            statValue = randomizeNum(hpScaling * 0.5, hpScaling);
            equipmentValue += statValue;
        } else if (statType === "atk") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            equipmentValue += statValue * 2.5;
        } else if (statType === "def") {
            statValue = randomizeNum(atkDefScaling * 0.5, atkDefScaling);
            equipmentValue += statValue * 2.5;
        } else if (statType === "atkSpd") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            equipmentValue += statValue * 8.33;
        } else if (statType === "vamp") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            equipmentValue += statValue * 20.83;
        } else if (statType === "critRate") {
            statValue = randomizeDecimal(crVampScaling * 0.5, crVampScaling);
            equipmentValue += statValue * 20.83;
        } else if (statType === "critDmg") {
            statValue = randomizeDecimal(cdAtkSpdScaling * 0.5, cdAtkSpdScaling);
            equipmentValue += statValue * 8.33;
        }

        // Check if stat type already exists in stats array
        let statExists = false;
        for (let j = 0; j < equipment.stats.length; j++) {
            if (Object.keys(equipment.stats[j])[0] == statType) {
                statExists = true;
                break;
            }
        }

        // If stat type already exists, add values together
        if (statExists) {
            for (let j = 0; j < equipment.stats.length; j++) {
                if (Object.keys(equipment.stats[j])[0] == statType) {
                    equipment.stats[j][statType] += statValue;
                    break;
                }
            }
        }
        // If stat type does not exist, add new stat to stats array
        else {
            equipment.stats.push({ [statType]: statValue });
        }
    }
    equipment.value = Math.round(equipmentValue);
    player.inventory.equipment.push(JSON.stringify(equipment));

    saveData();
    showInventory();
    showEquipment();
    return (`<span class="${equipment.rarity}">${equipmentIcon(equipment.category)}${equipment.rarity} ${equipment.category}</span>`);
};

const equipmentIcon = (equipment) => {
    if (equipment == "Sword") {
        return '<i class="ra ra-relic-blade"></i>';
    } else if (equipment == "Axe") {
        return '<i class="ra ra-axe"></i>';
    } else if (equipment == "Hammer") {
        return '<i class="ra ra-flat-hammer"></i>';
    } else if (equipment == "Dagger") {
        return '<i class="ra ra-bowie-knife"></i>';
    } else if (equipment == "Flail") {
        return '<i class="ra ra-chain"></i>';
    } else if (equipment == "Scythe") {
        return '<i class="ra ra-scythe"></i>';
    } else if (equipment == "Plate") {
        return '<i class="ra ra-vest"></i>';
    } else if (equipment == "Chain") {
        return '<i class="ra ra-vest"></i>';
    } else if (equipment == "Leather") {
        return '<i class="ra ra-vest"></i>';
    } else if (equipment == "Tower") {
        return '<i class="ra ra-shield"></i>';
    } else if (equipment == "Kite") {
        return '<i class="ra ra-heavy-shield"></i>';
    } else if (equipment == "Buckler") {
        return '<i class="ra ra-round-shield"></i>';
    } else if (equipment == "Great Helm") {
        return '<i class="ra ra-knight-helmet"></i>';
    } else if (equipment == "Horned Helm") {
        return '<i class="ra ra-helmet"></i>';
    }
};

// Show full detail of the item
const showItemInfo = (item, icon, type, i) => {
    sfxOpen.play();

    dungeon.status.exploring = false;
    let itemInfo = document.querySelector("#equipmentInfo");
    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let target = null;
    if (type == "Equip") {
        target = "#inventory";
    } else if (type == "Unequip") {
        target = "#dungeon-main";
    }
    let dimContainer = document.querySelector(`${target}`);
    itemInfo.style.display = "flex";
    dimContainer.style.filter = "brightness(50%)";
    itemInfo.innerHTML = `
            <div class="content">
                <h3 class="${item.rarity}">${icon}${item.rarity} ${item.category}</h3>
                <ul>
                ${item.stats.map(stat => {
        if (Object.keys(stat)[0] === "critRate" || Object.keys(stat)[0] === "critDmg" || Object.keys(stat)[0] === "atkSpd" || Object.keys(stat)[0] === "vamp") {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]].toFixed(2).replace(rx, "$1")}%</li>`;
        }
        else {
            return `<li>${Object.keys(stat)[0].toString().replace(/([A-Z])/g, ".$1").replace(/crit/g, "c").toUpperCase()}+${stat[Object.keys(stat)[0]]}</li>`;
        }
    }).join('')}
                </ul>
                <div class="button-container">
                    <button id="un-equip">${type}</button>
                    <button id="sell-equip"><i class="fas fa-coins" style="color: #FFD700;"></i>${nFormatter(item.value)}</button>
                    <button id="close-item-info">Close</button>
                </div>
            </div>`;

    // Equip/Unequip button for the item
    let unEquip = document.querySelector("#un-equip");
    unEquip.addEventListener('click', function () {
        if (type == "Equip") {
            // Remove the item from the inventory and add it to the equipment
            if (player.equipped.length >= 6) {
                sfxDeny.play();
            } else {
                sfxEquip.play();

                // Equip the item
                player.inventory.equipment.splice(i, 1);
                player.equipped.push(item);

                itemInfo.style.display = "none";
                dimContainer.style.filter = "brightness(100%)";
                playerLoadStats();
                saveData();
                continueExploring();
            }
        } else if (type == "Unequip") {
            sfxUnequip.play();

            // Remove the item from the equipment and add it to the inventory
            itemInfo.style.display = "none";
            dimContainer.style.filter = "brightness(100%)";
            player.equipped.splice(i, 1);
            player.inventory.equipment.push(JSON.stringify(item));
            playerLoadStats();
            saveData();
            continueExploring();
        }
    });

    // Close item info
    let close = document.querySelector("#close-item-info");
    close.addEventListener('click', function () {
        sfxDecline.play();

        itemInfo.style.display = "none";
        dimContainer.style.filter = "brightness(100%)";
        continueExploring();
    });
};

// Show inventory
const showInventory = () => {
    // Clear the inventory container
    let playerInventoryList = document.getElementById("playerInventory");
    playerInventoryList.innerHTML = "";

    if (player.inventory.equipment.length == 0) {
        playerInventoryList.innerHTML = "There are no items available.";
    }

    for (let i = 0; i < player.inventory.equipment.length; i++) {
        const item = JSON.parse(player.inventory.equipment[i]);

        // Create an element to display the item's name
        let itemDiv = document.createElement('div');
        let icon = equipmentIcon(item.category);
        itemDiv.className = "items";
        itemDiv.innerHTML = `<p class="${item.rarity}">${icon}${item.rarity} ${item.category}</p>`;
        itemDiv.addEventListener('click', function () {
            let type = "Equip";
            showItemInfo(item, icon, type, i);
        });

        // Add the itemDiv to the inventory container
        playerInventoryList.appendChild(itemDiv);
    }
};

// Show equipment
const showEquipment = () => {
    // Clear the inventory container
    let playerEquipmentList = document.getElementById("playerEquipment");
    playerEquipmentList.innerHTML = "";

    // Show a message if a player has no equipment
    if (player.equipped.length == 0) {
        playerEquipmentList.innerHTML = "Nothing equipped.";
    }

    for (let i = 0; i < player.equipped.length; i++) {
        const item = player.equipped[i];

        // Create an element to display the item's name
        let equipDiv = document.createElement('div');
        let icon = equipmentIcon(item.category);
        equipDiv.className = "items";
        equipDiv.innerHTML = `<p class="${item.rarity}">${icon}${item.rarity} ${item.category}</p>`;
        equipDiv.addEventListener('click', function () {
            let type = "Unequip";
            showItemInfo(item, icon, type, i);
        });

        // Add the equipDiv to the inventory container
        playerEquipmentList.appendChild(equipDiv);
    }
};

// Apply the equipment stats to the player
const applyEquipmentStats = () => {
    // Reset the equipment stats
    player.equippedStats = {
        hp: 0,
        atk: 0,
        def: 0,
        atkSpd: 0,
        vamp: 0,
        critRate: 0,
        critDmg: 0
    };

    for (let i = 0; i < player.equipped.length; i++) {
        const item = player.equipped[i];

        // Iterate through the stats array and update the player stats
        item.stats.forEach(stat => {
            for (const key in stat) {
                player.equippedStats[key] += stat[key];
            }
        });
    }
    calculateStats();
}

const unequipAll = () => {
    for (let i = player.equipped.length - 1; i >= 0; i--) {
        const item = player.equipped[i];
        player.equipped.splice(i, 1);
        player.inventory.equipment.push(JSON.stringify(item));
    }
    playerLoadStats();
    saveData();
}

const sellAll = (rarity) => {
    let rarityCheck = false;
    for (let i = 0; i < player.inventory.equipment.length; i++) {
        const equipment = JSON.parse(player.inventory.equipment[i]);
        if (equipment.rarity === rarity) {
            rarityCheck = true;
            break;
        }
    }
    if (rarityCheck) {
        sfxSell.play();
        for (let i = 0; i < player.inventory.equipment.length; i++) {
            const equipment = JSON.parse(player.inventory.equipment[i]);
            if (equipment.rarity === rarity) {
                player.gold += equipment.value;
                player.inventory.equipment.splice(i, 1);
                i--;
            }
        }
        playerLoadStats();
        saveData();
    } else {
        sfxDeny.play();
    }
}