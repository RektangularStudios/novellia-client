
import {
  OffChainResource,
  OccultaNovelliaCharacter,
  ProductProduct,
  NativeToken,
  Extended721Token,
  NovelliaStandardToken,
} from "novellia-sdk";
import ConvertCase from "./ConvertCase";


interface nativetoken extends NativeToken {
  otherData? : any,
  metadata? : any
}

interface extended721token extends Extended721Token{
  otherData? : any,
  metadata? : any
}

interface novelliastandardtoken extends NovelliaStandardToken{
  otherData? : any,
  metadata? : any
}

class ResourceService {
  // This is a staging service that should eventually go into the Novellia SDK
  // To reiterate: most of what is in here is a hack to get this working quickly
  public cardResourceId = "Card";
  public artworkResourceId = "Artwork";
  public thumbnailResourceId = "Thumbnail";
  public animationResourceId = "Animation";
  public videoResourceId = "Video";
  public audioResourceId = "Soundtrack";
  public modelResourceId = "3DModel";
  public occultaNovelliaCharacterResourceId = "OccultaNovelliaCharacter";
  public novelliaResourceId = "Novellia";
  public interactiveResourceId = "Interactive";
  public fetchTimeoutMs = 40000;

  mimeTypeToAssetType(mediaType){
    if(mediaType.indexOf("html") > -1){
      return this.interactiveResourceId;
    }
    if(mediaType.indexOf("image") > -1){
      return this.artworkResourceId;
    }
    if(mediaType.indexOf("video") > -1){
      return this.videoResourceId;
    }
    if(mediaType.indexOf("audio") > -1){
      return this.audioResourceId;
    }
    if(mediaType.indexOf("model") > -1){
      return this.modelResourceId;
    } 
    return "";
  }

  getHashSourceType(url : string){
    if(url.indexOf("http://") > -1){
      return "http";
    }
    if(url.indexOf("https://") > -1){
      return "https";
    }
    if(url.indexOf("ipfs://") > -1){
      return "ipfs";
    }
    if(url.indexOf("sia") > -1){
      return "sia";
    }
    return "";
  }

  getMultihash(url : string) : string | void {
    const hash = url.split("/").reverse();
    let multihash;
    let found = false;
    for(let item of hash){
      if(item.length > 1 && !found){
        multihash = item;
        found = true;
      }
    }
    return multihash;

  }

  // https://github.com/github/fetch/issues/175#issuecomment-216791333
  timeoutPromise<type>(ms, promise): Promise<type> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("promise timeout"));
      }, ms);
      promise.then(
        (res) => {
          clearTimeout(timeoutId);
          resolve(res);
        },
        (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      );
    });
  }

  fixUrl(url : string | Array<string>){
    let assetUrl = url;
    if(typeof assetUrl !== "undefined"){
      if(Array.isArray(assetUrl)){
        assetUrl = assetUrl.join("");
      }
      const siaPrefix = "sia";
      const ipfsPrefix = "ipfs";

      const multihash = this.getMultihash(assetUrl);
      
    

      if(multihash){
        
        if(url.indexOf(siaPrefix) > -1){
          return siaPrefix + "://" + multihash;
        }
    
        if(url.indexOf(ipfsPrefix) > -1){
      
          return ipfsPrefix + "://" + multihash;
        }

      }
    }
    return assetUrl;
  }

  fixListDecentralizedUrls(urls : string[]){
    let fixedUrls : string[] = [];
    if(typeof urls !== "undefined"){
      for(var url of urls){
        fixedUrls.push(this.fixUrl(url));
      }
    }
    return fixedUrls;
  }

  fixNVLAResourceUrls(resources : any[]){
    let fixedResources :any[] = [];
    if(typeof resources !== "undefined"){
      for(var resource of resources){
        resource.url = this.fixListDecentralizedUrls(resource.url);
        fixedResources.push(resource);
      }
    }
    return fixedResources;
  }

  translateDecentralizedUrl(url: string): Array<string> {
    const siaPrefix = "sia://";
    const siaPortal = "https://siasky.net/";

    const ipfsPrefix = "ipfs://";
    const ipfsGateways = [
      "https://ipfs.blockfrost.dev/ipfs/",
      "https://ipfs.infura.io/ipfs/",
      "https://api.rektangularstudios.com/ipfs/",
    ];

    const httpPattern =
      "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)";

    if (url.startsWith(siaPrefix)) {
      return [url.replace(siaPrefix, siaPortal)];
    }
    if (url.startsWith(ipfsPrefix)) {
      const ipfsUrls: Array<string> = [];
      for (const ipfsGateway of ipfsGateways) {
        ipfsUrls.push(url.replace(ipfsPrefix, ipfsGateway));
      }
      return ipfsUrls;
    }
    if (url.match(httpPattern)) {
      return [url];
    }
    return ["https://" + url];
  }

  // returns a validated URL of local blob or throws if the resource cannot be resolved
  async blobLoader(resp: Response): Promise<string> {
    const blob = await resp.blob();
    return await URL.createObjectURL(blob);
  }

  // returns a Novellia resource from a Fetch response
  async novelliaLoader(
    resp: Response
  ): Promise<NovelliaStandardToken> {
    return await resp.json();
  }

  // returns an Occulta Novellia Character from a Fetch response
  async occultaNovelliaCharacterLoader(
    resp: Response
  ): Promise<OccultaNovelliaCharacter> {
    return await resp.json();
  }

  // accepts a list of resources
  // 1. finds resource matching resourceId
  // 2. selects matched resource with highest priority (<= priority)
  // 3. iterates redundant URLs in order, trying to find one that works
  async fetchResource<Type>(
    resource: OffChainResource[],
    resourceId: string,
    loader: (resp: Response) => Promise<Type>,
    priority: number
  ): Promise<Type> {

    const matchedResources = resource.filter(
      r => r.resourceId === resourceId && r.priority <= priority
    );
    if (!matchedResources || matchedResources.length === 0) {
      console.log("resourceId not found:", resourceId);
      return Promise.reject(
        "failed to fetch resource, resourceId not found or priority too low"
      );
    }

    const highestMatchedPriority = Math.max(
      ...matchedResources.map(function(r) {
        return r.priority;
      }),
      -1
    );
    const resourceIndex = matchedResources.findIndex(
      r => r.priority === highestMatchedPriority
    );
    if (resourceIndex !== -1) {
      const foundResource = matchedResources[resourceIndex];
      for (const url of foundResource.url) {
        const translatedUrls = this.translateDecentralizedUrl(url);
        for (const translatedUrl of translatedUrls) {
          try {
            const response = await this.timeoutPromise<Response>(this.fetchTimeoutMs, fetch(translatedUrl)).then(resp => {
              if (resp.ok) {
                return loader(resp);
              } else {
                console.log(response);
                throw new Error("resource url failed");
              }
            });
            return await response;
          } catch (e) {
            console.log(
              "resource url failed:",
              url,
              "translated as:",
              translatedUrl,
              e
            );
            continue;
          }
        }
      }
    }

    return Promise.reject("failed to fetch resource");
  }

  
  async fetchResourceInferLoader(
    resource: OffChainResource[],
    resourceId: string,
    priority: number
  ): Promise<any> {
    let loader: (resp: Response) => Promise<any>;
    const occultaNovelliaCharacterResourceIds = [this.occultaNovelliaCharacterResourceId];
    const novelliaResourceIds = [this.novelliaResourceId];
    const blobLoaderResourceIds = [this.artworkResourceId, this.cardResourceId, this.videoResourceId,this.modelResourceId];
    if (blobLoaderResourceIds.includes(resourceId)) {
      loader = this.blobLoader;
    } else if (occultaNovelliaCharacterResourceIds.includes(resourceId)) {
      loader = this.occultaNovelliaCharacterLoader;
    } else if (novelliaResourceIds.includes(resourceId)) {
      loader = this.novelliaLoader;
    } else {
      return Promise.reject("unknown resource ID, cannot infer loader");
    }
    return await this.fetchResource(resource, resourceId, loader, priority);
  }

  // see Novellia metadata standard: https://rektangularstudios.github.io/novellia_token_standard.html
  // mint example: https://cardanoscan.io/transaction/63de4b86d00dd68d253956c02fb6fc8574e95267f31ddea437ec023df6d55d6f?tab=metadata
  async parseNovelliaStandardMetadata(nativeToken: NativeToken, metadataObj: any): Promise<novelliastandardtoken> {
    let assetObj = ConvertCase(metadataObj[nativeToken.policyId][nativeToken.assetId]);
    let descShort = "";
    let descLong = "";
    if ("description" in assetObj) {
      descShort = assetObj["description"]["short"];
      descLong = assetObj["description"]["long"];
    }
    
    
    let t: NovelliaStandardToken = {
      copyright: metadataObj["copyright"] || "",
      publisher: metadataObj["publisher"] || [],
      version: metadataObj["version"] || 0,
      // should be a given, but may have multiple extensions
      extension: metadataObj["extension"] || [],
      id: assetObj["id"] || 0,
      name: assetObj["name"] || "",
      image: assetObj["image"] || "",
      description: {
        _short: descShort,
        _long: descLong,
      },
      resource: this.fixNVLAResourceUrls(assetObj["resource"]) || [],
      commission: assetObj["commission"] || [],
      nativeToken: nativeToken,
      // TODO: handle multiple versions, when there are multiple
      novelliaVersion: 1,
      tags: assetObj["tags"] || [],
    };
    

    // check for Novellia resource
    if("resource" in assetObj){
      let novelliaIndex = assetObj["resource"].findIndex(element => element.resourceId === "Novellia");
      if (novelliaIndex !== -1) {
        let nvla: NovelliaStandardToken = await this.fetchResourceInferLoader(
          assetObj["resource"],
          "Novellia",
          0
        );
        nvla = ConvertCase(nvla);
    
        const token = {
          copyright: nvla["details"]["copyright"] ? nvla["details"]["copyright"] : metadataObj["copyright"] || "",
          publisher: nvla["publisher"] ? nvla["publisher"] : metadataObj["publisher"] || [],
          version: nvla["version"] ? nvla["version"] : metadataObj["version"] || 0,
          // should be a given, but may have multiple extensions
          extension: nvla["extension"] ? nvla["extension"] : metadataObj["extension"] || [],
          id: assetObj["id"] || 0,
          name: nvla["details"]["name"] ? nvla["details"]["name"] : assetObj["name"] || "",
          image: nvla["image"] ? nvla["image"] : assetObj["image"] || "",
          description: nvla["details"]["description"] ? nvla["details"]["description"] : {
            _short: descShort,
            _long: descLong,
          },
          resource: nvla["details"]["resource"] ? this.fixNVLAResourceUrls(nvla["details"]["resource"]) : this.fixNVLAResourceUrls(assetObj["resource"]) || [],
          commission: nvla["details"]["commission"] ? nvla["details"]["commision"] : assetObj["commission"] || [],
          nativeToken: nativeToken,
          // TODO: handle multiple versions, when there are multiple
          novelliaVersion: 1,
          tags: nvla["details"]["tags"] ? nvla["details"]["tags"] : assetObj["tags"] || [],
        };
        
        t = ConvertCase(token);
      }
    }
    if("novelliaJson" in assetObj && "novelliaMultihash" in assetObj && "novelliaHashSourceType" in assetObj){
      const resource = [
        {
          hashSourceType : assetObj["novelliaHashSourceType"], 
          multihash : assetObj["novelliaMultihash"],
          url : this.fixListDecentralizedUrls(assetObj["novelliaJson"]),
          priority : 0,
          contentType: "application/json",
          resourceId: "Novellia",
          description: "Off-chain Novellia extended metadata"

        }
      ];
      
   
      let nvla : NovelliaStandardToken | Array<NovelliaStandardToken> = await this.fetchResourceInferLoader(
        resource,
        "Novellia",
        0
      );

      if(Array.isArray(nvla)){
        const item = nvla.find(x => x.hasOwnProperty(nativeToken.assetId));
        nvla = item ? item[nativeToken.assetId] : nvla;
        t = {
          copyright: nvla["copyright"] ? nvla["copyright"] : metadataObj["copyright"] || "",
          publisher: nvla["publisher"] ? nvla["publisher"] : metadataObj["publisher"] || [],
          version: nvla["version"] ? nvla["version"] : metadataObj["version"] || 0,
          // should be a given, but may have multiple extensions
          extension: nvla["extension"] ? nvla["extension"] : metadataObj["extension"] || [],
          id: assetObj["id"] || 0,
          name: nvla["name"] ? nvla["name"] : assetObj["name"] || "",
          image: nvla["image"] ? nvla["image"] : assetObj["image"] || "",
          description: nvla["description"] ? nvla["description"] : {
            _short: descShort,
            _long: descLong,
          },
          resource: nvla["resource"] ? this.fixNVLAResourceUrls(nvla["resource"]) : this.fixNVLAResourceUrls(assetObj["resource"]) || [],
          commission: nvla["commission"] ? nvla["commision"] : assetObj["commission"] || [],
          nativeToken: nativeToken,
          // TODO: handle multiple versions, when there are multiple
          novelliaVersion: 1,
          tags: nvla["tags"] ? nvla["tags"] : assetObj["tags"] || [],
        };
        
      }

      t = ConvertCase(t);   
    }
    
    let tprime : novelliastandardtoken = t;
    tprime.metadata = metadataObj;
    tprime.otherData = assetObj;
    delete tprime.otherData.description;
    delete tprime.otherData.descriptionShort;
    delete tprime.otherData.descriptionLong;
    delete tprime.otherData.id;
    delete tprime.otherData.image;
    delete tprime.otherData.name;
    delete tprime.otherData.resource;
    delete tprime.otherData.tags;
    delete tprime.otherData.copyright;
    delete tprime.otherData.novelliaHashSourceType;
    delete tprime.otherData.novelliaMultihash;
    delete tprime.otherData.novelliaMultihash;
    delete tprime.otherData.novelliaJson;
    return tprime;
  }

  async parseExtended721Metadata(nativeToken: NativeToken, metadataObj: any): Promise<extended721token> {
    // ignore non-"novellia_1" extensions for now
    const assetObj = metadataObj[nativeToken.policyId][nativeToken.assetId];

    const t: Extended721Token = {
      // should be a given, but may have multiple extensions
      extension: metadataObj["extension"] || [],
      id: assetObj["id"] || 0,
      name: assetObj["name"] || "",
      image: assetObj["image"] || "",
      files: assetObj["files"] || "",
      mediaType: assetObj["mediaType"] || "",
      description: assetObj["description"] || "",
      nativeToken: nativeToken,
    };

    if ("offchain" in assetObj) {
      const translatedUrls = this.translateDecentralizedUrl(assetObj["offchain"]);
      for (const translatedUrl of translatedUrls) {
        try {
          const resp = await this.timeoutPromise<Response>(this.fetchTimeoutMs, fetch(translatedUrl));
          const offchain = resp.json();
          if (nativeToken.assetId in offchain) {
            // offchain takes precedence, overwrite duplicated fields
            t.id = offchain["id"] || t.id;
            t.name = offchain["name"] || t.name;
            t.image = offchain["image"] || t.image;
            t.files = offchain["files"] || t.files;
            t.mediaType = offchain["files"] || t.mediaType;
            t.description = offchain["description"] || t.description;
          } else {
            return Promise.reject("asset ID not found in extended 721 offchain metadata");
          }
        } catch (e) {
          console.log(
            "resource url failed:",
            assetObj["offchain"],
            "translated as:",
            translatedUrl,
            e
          );
          continue;
        }
      }
    }

    let tprime : extended721token = t;
    tprime.metadata = metadataObj;
    tprime.otherData = assetObj;
    delete tprime.otherData.image;
    delete tprime.otherData.name;
    delete tprime.otherData.offchain;
    delete tprime.otherData.id;
    delete tprime.otherData.files;
    delete tprime.otherData.mediaType;
    delete tprime.otherData.description;
    delete tprime.otherData.mime;

    return tprime;

  }

  async parse721Metadata(
    nativeTokenId: string,
    metadata721: string
  ): Promise<ProductProduct> {
    // parse metadata into an untyped object
    const metadataObj = JSON.parse(metadata721);
  
    
    // extract policy and asset IDs
    const fields = nativeTokenId.split(".");
    if (fields.length != 2) {
      return Promise.reject("invalid nativeTokenId");
    }

    // check if asset is defined in metadata per extended 721
    // if not, this is a non-metadata Native Token
    const nativeToken: NativeToken = {
      policyId: fields[0],
      assetId: fields[1],
    };
    if (!(nativeToken.policyId in metadataObj)) {
      return { nativeToken: nativeToken };
    }
    if (!(nativeToken.assetId in metadataObj[nativeToken.policyId])) {
      return { nativeToken: nativeToken };
    }

    // check if asset has the "novellia_1" extension
    // would indicate token follows Novellia Metadata Standard

  
    if ("extension" in metadataObj && metadataObj["extension"].includes("novellia_1")) {
      return {
        novelliaStandardToken: await this.parseNovelliaStandardMetadata(nativeToken, metadataObj)
      };
    } else {
      // assume token is Extended 721
      const extendedToken = await this.parseExtended721Metadata(nativeToken, metadataObj);
      return {
        extended721Token: extendedToken
      };
    }
  }

}


const instance = new ResourceService();
Object.freeze(instance);
export default instance;
