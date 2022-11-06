import { Request, Response } from "express";
import axios from "axios";
import { CharGenRequest, GetCharGen } from "../dto/CharGenRequest";
const link = "https://www.novaragnarok.com/ROChargenPHP";

export const getCharGenLink = async (req: Request, res: Response) => {
    const {
        mode,
        first,
        second,
        name,
    } = req.body as CharGenRequest;

    const fullLink = `${link}/${GetCharGen(mode)}/${name}/${first}/${second}?${Date.now()}`;
    const result = await axios.get(fullLink);
    return res.send(result.data);
};