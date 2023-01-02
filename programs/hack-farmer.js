/** @param {NS} ns */
export async function main(ns) {
    // Custom color coding.
    const cyan = "\u001b[36m";
    const green = "\u001b[32m";
    const red = "\u001b[31m";
    const reset = "\u001b[0m";


    const serverOverride = ns.args[0]
    
    if (serverOverride) {
        ns.print('Overriding server: ' + serverOverride)
    } else {
        ns.print(`No server override detected defaulting to n00dles`)
    }

    // Defines the "target server", which is the server
    // that we're going to hack. In this case, it's "n00dles"
    var target = serverOverride || "n00dles";
    
    // Defines how much money a server should have before we hack it
    // In this case, it is set to 75% of the server's max money
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    
    // Defines the maximum security level the target server can
    // have. If the target's security level is higher than this,
    // we'll weaken it before doing anything else
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    
    ns.print(`Current security threshold: ${securityThresh}\nCurrent cash threshold: ${moneyThresh}`)

    // If we have the BruteSSH.exe program, use it to open the SSH Port
    // on the target server
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(target);
    }
    
    if (ns.fileExists("ServerProfiler.exe", "home")) {
        ns.brutessh(target);
    }

    // Get root access to target server
    ns.nuke(target);
    
    
    var hackCount = 0
    var hackLimit = 10 // Set hack limit to then sleep and restart to gain more XP
    
    var sleepTime = 5000 // ms 5s

    // Infinite loop that continously hacks/grows/weakens the target server
    while(true) {

        ns.print(`${cyan}Hacking chance: ${hackAnalyzeChance(target)}${reset}`)

        if (ns.getServerSecurityLevel(target) > securityThresh) {
            // If the server's security level is above our threshold, weaken it
            ns.print('INFO ℹ running weaken...⏳')
            await ns.weaken(target);

        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            // If the server's money is less than our threshold, grow it
            ns.print('INFO ℹ running grow...⏳')
            await ns.grow(target);

        } else {
            // Otherwise, hack it
            if (hackCount !== hackLimit) {
                ns.print(`SUCCESS Hacking target: \u001b[36m${target} - current iteration ${hackCount}/${hackLimit}\u001b[0m`)
                await ns.hack(target);
                hackCount += 1
           } else {
            ns.print(`INFO Sleeping target: ${target} - current iteration ${hackCount}/${hackLimit}\n letting build up of next batch`)
                hackCount = 0
               await ns.sleep(sleepTime)
           }
        }
    }
    
    }