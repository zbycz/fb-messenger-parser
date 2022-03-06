const messageFolder = "./messages/inbox";
const fs = require("fs");

function read(folder) {
  return new Promise((res) =>
    fs.readdir(folder, (err, files) => {
      res(files);
    })
  );
}


const months = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6, "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12};

function parseFbDate(date) { // =Jul 23, 2015 10:34:15pm
  const mon = months[date.substr(0,3)]
  const day = date.substr(4,2)
  const year = date.substr(8,4)
  return `${year}-${mon}` //-${day}`;
}

async function main() {
  let folders = [];

  const files = await read(messageFolder);
  files.forEach((file) => {
    folders.push(messageFolder + "/" + file);
  });


  for (const path of folders) {
    const files = fs.readdirSync(path);
    const count = files.filter((x) => x.match(/message/)).length;
    if (count > 1) {
      console.log("Warning: this folder has multiple message files. It wont be counted.", path)
    }
  }


  //
  // <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
  //   <div className="_3-96 _2pio _2lek _2lel">Živá kultura</div>
  //   <div className="_3-96 _2let"></div>
  //   <div className="_3-94 _2lem">Jul 14, 2015 9:03:29am</div>
  // </div>
  //
  // <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
  //   <div className="_3-96 _2pio _2lek _2lel">Pavel Zbytovský</div>
  //   <div className="_3-96 _2let"></div>
  //   <div className="_3-94 _2lem">May 14, 2021 11:55:15am</div>
  // </div>
  // <div className="pam _3-95 _2pi0 _2lej uiBoxWhite noborder">
  //   <div className="_3-96 _2pio _2lek _2lel">Adam Bolen</div>
  //   <div className="_3-96 _2let"></div>
  //   <div className="_3-94 _2lem">May 13, 2021 9:11:41pm</div>
  // </div>
  const regexp = /_3-96 _2pio _2lek _2lel">(?<name>[^<]+).+?_3-94 _2lem">(?<date>[^<]+)/g;

  const dataset = {}

  for (let path of folders) {
    const file = path + "/message_1.html";
    console.log(file, " ----------------------")

    const content = fs.readFileSync(file).toString('utf-8');
    const matches = content.matchAll(regexp);

    for (const {groups} of matches) {
      if (groups.name !== "Pavel Zbytovský")
        continue;

      const date=parseFbDate(groups.date)

      dataset[date] = dataset[date] ? dataset[date]+1 : 1;
    }
    // break
  }

  // console.log(dataset)

  const csv = Object.entries(dataset).map(row => `${row[0]}, ${row[1]}`).join("\n");
  fs.writeFileSync('./data.csv', csv)

  console.log("Results written to data.csv")
}
main();


