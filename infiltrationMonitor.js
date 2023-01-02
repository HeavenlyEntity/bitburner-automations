/** @param {NS} ns */
export async function main(ns) {
  /**
   * Author: Haven Bitly
   * Infiltration monitor
   *
   * Description: Will check all locations and list out the ones that have the
   * highest chance of being vulnerable.
   */

  //Open logs from foo.script on the current server that was run with no args
  var DEBUG_MODE = false;
  const green = "\u001b[32m";
  const reset = "\u001b[0m";
  DEBUG_MODE && ns.tail("/programs/infiltrationMonitor.js");

  ns.print(`INFO: Getting locations list...⏳`);

  var locationsList = ns.infiltration.getPossibleLocations();

  ns.printf(`SUCCESS: Locations list retrieved...✅ %j`, locationsList);

  let difficultyList = [];

  if (locationsList.length !== 0) {
    ns.print(`SUCCESS Locations gathered...${locationsList.length}`);

    locationsList.forEach((location, i) => {
      ns.print(`INFO Getting location difficulty...⏳ - ${location.name}`);
      let locationDifficultyLevel = ns.infiltration.getInfiltration(
        location.name
      );

      //   let example = {
      //     location: {
      //       city: "Volhaven",
      //       costMult: 0,
      //       expMult: 0,
      //       name: "SysCore Securities",
      //       types: [0],
      //       techVendorMaxRam: 0,
      //       techVendorMinRam: 0,
      //       infiltrationData: {
      //         maxClearanceLevel: 18,
      //         startingSecurityLevel: 4.77,
      //       },
      //     },
      //     reward: {
      //       tradeRep: 19349.35680836175,
      //       sellCash: 112164030.72074203,
      //       SoARep: 1401.2925969447706,
      //     },
      //     difficulty: 3,
      //   };

      ns.printf(
        `SUCCESS Location difficulty gathered...⏳ - %j`,
        locationDifficultyLevel
      );

      let formattedStringListing = 
      `======================== ${i + 1}/${locationsList.length} =========================
       Company: ${locationDifficultyLevel.location.name}
       City: ${locationDifficultyLevel.location.city}
       -------------------------------------------------
       Cost-Multipler: ${locationDifficultyLevel.location.costMult}
       Expense-Multipler: ${locationDifficultyLevel.location.expMult}
       -------------------------------------------------
       TYPES: ${locationDifficultyLevel.location.types.toString()}
       -------------------------------------------------
       REQUIREMENTS
       * Clearance Level: ${
         locationDifficultyLevel.location.infiltrationData.maxClearanceLevel
       }
       * Starting Security Level: ${
         locationDifficultyLevel.location.infiltrationData.startingSecurityLevel
       }
       -------------------------------------------------
       DIFFICULTY: ${locationDifficultyLevel.difficulty}
       RAM (Bytes)
       * MAX: ${locationDifficultyLevel.location.techVendorMaxRam}
       * MIN: ${locationDifficultyLevel.location.techVendorMinRam}
       -------------------------------------------------
       Reward
       * Trade Reputation: ${locationDifficultyLevel.reward.tradeRep}
       * Sell Cashing: ${locationDifficultyLevel.reward.sellCash}
       * SoA Reputation: ${locationDifficultyLevel.reward.SoARep}
       -------------------------------------------------\n
      `;

      ns.printf(
        `SUCCESS Location difficulty formatted... - %s`,
        formattedStringListing
      );

      difficultyList.push(formattedStringListing);
    });

  } else {
    ns.print("WARNING: No current locations found");
  }

  // Write data found into a report folder file.

  let filename = `Infiltration_Report--${new Date()
    .toDateString()
    .split(" ")
    .join("-")}`;

  ns.write(`${filename}.txt`, difficultyList.join(""), "w");

  // Check if file was created successfully
  let createdReport = ns.fileExists(`${filename}.txt`, "home");

  if (createdReport) {
    // Move report to "reports" folder
    ns.print(
      `SUCCESS: Report generated! ${filename} - moving to reports folder...`
    );
    ns.mv("home", `${filename}.txt`, `/reports/${filename}.txt`);
    ns.tprint(
      `${green}Report generated successfully! ${filename} - You can view it in the "reports" folder.${reset}`
    );
  } else {
    ns.print(
      `ERROR: Report not generated! ${filename} - moving to reports folder failed.`
    );
  }

  ns.print(`SUCCESS report generated successfully! ${filename}`);
}
