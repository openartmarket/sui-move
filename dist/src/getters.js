export function getCreatedObjects(txRes) {
    return (txRes.objectChanges || []).filter((change) => change.type === "created");
}
export function getObjectData(response) {
    const { error, data } = response;
    if (error) {
        throw error;
    }
    if (!data) {
        throw new Error(`No data: ${JSON.stringify(response)}`);
    }
    return data;
}
export function getParsedData(data) {
    const { content } = data;
    if (!content) {
        throw new Error(`No content: ${JSON.stringify(data)}`);
    }
    return content;
}
export function getType(data) {
    return getMoveObject(data).type;
}
export function getStringField(data, key) {
    const { fields } = getMoveObject(data);
    if (!fields) {
        throw new Error(`No txn.data.content.fields: ${JSON.stringify(data)}`);
    }
    function getStringField(struct, key) {
        if (Array.isArray(struct)) {
            throw new Error(`Unexpected response.data.content.fields as array: ${JSON.stringify(data)}`);
        }
        if (!(key in struct)) {
            throw new Error(`No response.data.content.fields[${key}]: ${JSON.stringify(data)}`);
        }
        const value = Reflect.get(struct, key);
        if (typeof value !== "string") {
            throw new Error(`Unexpected type for response.data.content.fields[${key}]: ${JSON.stringify(data)}`);
        }
        return value;
    }
    return getStringField(fields, key);
}
function getMoveObject(data) {
    const { dataType } = data;
    if (dataType !== "moveObject") {
        throw new Error(`Unexpected txn.data.content.dataType: ${JSON.stringify(data)}`);
    }
    return data;
}
export function getIntField(data, key) {
    const value = getStringField(data, key);
    return toInt(value);
}
function toInt(s) {
    if (!s.match(/^[0-9]+$/)) {
        throw new Error(`${s} is not a valid integer`);
    }
    const number = parseInt(s, 10);
    if (isNaN(number) || !Number.isInteger(number)) {
        throw new Error(`${s} is not a valid integer`);
    }
    return number;
}
//# sourceMappingURL=getters.js.map