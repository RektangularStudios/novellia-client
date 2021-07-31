export default function(searchAddress : string){
  let address: RegExp = /^addr([A-Za-z0-9]{99,}$)/;
  let stake: RegExp = /^stake([A-Za-z0-9]{54,}$)$/;
  return address.test(searchAddress) || stake.test(searchAddress);
}