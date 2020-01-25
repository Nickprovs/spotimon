import SpatialInfo from "./info/spatialInfo";
import ManifestationInfo from "./info/manifestationInfo";
import DomainInfo from "./info/domainInfo";

export default class NBodyItem {
  constructor(spatialArgs, manifestationArgs, domainArgs) {
    this.spatial = new SpatialInfo(spatialArgs);
    this.domain = new DomainInfo(domainArgs);
    this.manifestation = new ManifestationInfo(manifestationArgs, this.domain);
  }
}
