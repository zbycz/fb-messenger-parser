const fs = require("fs");

function read(folder) {
  return new Promise((res) =>
    fs.readdir(folder, (err, files) => {
      res(files);
    })
  );
}

async function main() {
  let folders = [];

  const files = await read("./messages/inbox");
  files.forEach((file) => {
    folders.push("./messages/inbox" + "/" + file);
  });


  for (const path of folders) {
    const files = fs.readdirSync(path);
    const count = files.filter((x) => x.match(/message/)).length;
  }

  const dataset = {}

  for (let path of folders) {
    const files = fs.readdirSync(path);
    const json_files = files.filter((x) => x.match(/\.json$/));

    for (let f of json_files) {
      const file = path + "/" + f;
      console.log(file, " ----------------------")

      const content = fs.readFileSync(file).toString('utf-8');
      const parsed = JSON.parse(content);
      parsed.messages.forEach(msg => {
        if (msg.sender_name === "Pavel Zbytovsk\u00c3\u00bd") {
          const date = new Date(msg.timestamp_ms).toISOString().substr(0, 7)
          dataset[date] = dataset[date] ? dataset[date] + 1 : 1;
        }
      })
    }
    // break
  }

  //console.log(dataset)

  const csv = Object.entries(dataset).map(row => `${row[0]}, ${row[1]}`).join("\n");
  fs.writeFileSync('./data.csv', csv)

  console.log("Results written to data.csv")
}
main();


