import ResourceService from "./ResourceService";
/*
import { NovelliaService, Wallet } from "novellia-sdk";

function createNovelliaService(): NovelliaService {
  const basePath = "https://api-demo.rektangularstudios.com/novellia";
  return new NovelliaService({
      basePath: basePath,
  });
}
*/

test("novellia_token", () => {
  /*
  const s = createNovelliaService();
  const wallet: Wallet = {
    cardanoIdentifiers: ["addr1qx4kcwnuft7c6dh44ftd2lscgraq687yt3wjcqtz2puylf0vn8jpsqn3lwt7kdh5m9lkemaqqfm2qlxs8q6hrd56682qdjspt9"],
  }
  s.wallet(wallet).then(r => console.log(r)).catch(e => console.log("error",e));
  */
  
  const nativeTokenId = "d27dadf7c5f24bfe9e377927c2d811d63d19222e1a53bb50cbb51772.AlphaDraculi";
  const metadata = "{\"version\": 1, \"copyright\": \"Copyright Rektangular Studios Inc.; all rights reserved\", \"extension\": [\"novellia_1\"], \"publisher\": [\"https://rektangularstudios.com\"], \"d27dadf7c5f24bfe9e377927c2d811d63d19222e1a53bb50cbb51772\": {\"AlphaDraculi\": {\"id\": 3, \"name\": \"Alpha Draculi\", \"tags\": [\"Collectible Character\"], \"image\": \"ipfs://QmTUkcUb2EHSw7Ptd52zeuKwgf8G4iVMczXJdMz8XN3dzd\", \"resource\": [{\"url\": [\"https://api.rektangularstudios.com/static/r0tngydjh7x0/nvla.json\", \"ipfs://QmdEN1b9xi5R44tssj5CojMBCwXYTh5P6pHKV6YcPogCXZ\", \"sia://AAAG1QULaSR9sguw63RnlyGGDYsygLW8rbHlG-_kcf9IYQ\"], \"priority\": 0, \"multihash\": \"QmdEN1b9xi5R44tssj5CojMBCwXYTh5P6pHKV6YcPogCXZ\", \"description\": \"Off-chain Novellia extended metadata\", \"resource_id\": \"Novellia\", \"content_type\": \"application/json\", \"hash_source_type\": \"ipfs\"}], \"description\": {\"long\": \"A character for the surreal horror multiverse Occulta Novellia\", \"short\": \"Occulta Novellia Character\"}}}}";
  ResourceService.parse721Metadata(nativeTokenId, metadata).then(res => console.log(res)).catch(e => console.log(e));
});

test("721_token_onchain", () => {
  const nativeTokenId = "cd4f09ef0a8f9a3557903d2c9a45b2f6198f1267c2031bc9228ed74a.SushiByte0154";
  const metadata = `{
    "cd4f09ef0a8f9a3557903d2c9a45b2f6198f1267c2031bc9228ed74a": {
      "SushiByte0154": {
        "accessory": "shuriken",
        "arweaveId": "bFdArD1RtzwiNQSCocfAaKg0z2T-IiZ2DCCp-oVQbTk",
        "base": "plain rice",
        "face": "shy green",
        "headband": "seaweed",
        "id": "0154",
        "image": "ipfs://ipfs/QmcqYk164cZXjSUVxT4pVmmFie6S6gtBbbatkVTfEmvdjR",
        "name": "SushiByte 0154",
        "nigiri": "tamago"
      }
    }
  }`;
  ResourceService.parse721Metadata(nativeTokenId, metadata).then(res => console.log(res)).catch(e => console.log(e));
});