import Description from '../structure/Description';
interface ScanLANServer {
    host: string;
    port: number;
    description: Description;
}
interface ScanLANResponse {
    servers: ScanLANServer[];
}
export { ScanLANResponse, ScanLANServer };
