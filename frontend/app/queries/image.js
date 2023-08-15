import axios from "axios";
import {API_URL} from "../../const";

export const createImg = async ({apiKey, payload}) => {
    let config = {
        method: "POST",
        url: API_URL + "/api/v1/images",
        headers: {
            "x-imgfly-api-key": apiKey,
        },
        data: payload,
    };

    const response = await axios
        .request(config)
        .then(({data, status}) => {
            return {
                status: status,
                message: data?.message,
                imgURL: data?.newImage?.imageUrl,
            };
        })
        .catch((error) => {
            console.log(error);
            return {
                status: error.response?.status,
                message: error.response?.data.message,
            };
        });

    return response;
};
