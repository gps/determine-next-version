const core = require("@actions/core");
const github = require("@actions/github");
const env = process.env;

function setBuildVersion(buildVersion) {
  core.setOutput("NEXT_BUILD_VERSION", buildVersion);
}

async function run() {
  const token = core.getInput("GH_TOKEN");
  const octokit = new github.GitHub(token);
  const owner = env.GITHUB_REPOSITORY.split("/")[0];
  const repo = env.GITHUB_REPOSITORY.split("/")[1];

  const response = await octokit.repos.listTags({
    owner,
    repo,
  });
  const versionTagRegex = new RegExp("v(\\d+)\\.(\\d+)\\.(\\d+)$");

  const tags = response["data"]
    .map((obj) => obj["name"])
    .filter((el) => el.match(versionTagRegex));

  if (tags.length < 1) {
    setBuildVersion('v0.0.1');
    return;
  }

  tags.sort((l, r) => {
    const lx = parseInt(l.split(".")[0]);
    const rx = parseInt(r.split(".")[0]);
    if (lx < rx) {
      return 1;
    }
    if (rx < lx) {
      return -1;
    }
    const ly = parseInt(l.split(".")[1]);
    const ry = parseInt(r.split(".")[1]);
    if (ly < ry) {
      return 1;
    }
    if (ry < ly) {
      return -1;
    }
    const lz = parseInt(l.split(".")[2]);
    const rz = parseInt(r.split(".")[2]);
    if (lz < rz) {
      return 1;
    }
    if (rz < lz) {
      return -1;
    }
    return 0;
  });
  const split = tags[0].substring(1).split(".");
  const nextX = parseInt(split[0]);
  const nextY = parseInt(split[1]);
  const nextZ = parseInt(split[2]) + 1;

  setBuildVersion(`v${nextX}.${nextY}.${nextZ}`);
}

run();
