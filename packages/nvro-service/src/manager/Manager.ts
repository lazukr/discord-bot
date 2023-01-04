export interface Manager<Req, Res> {
    get(request: Req): Promise<Res>;
}