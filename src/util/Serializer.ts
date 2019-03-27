const TYPE_KEY = '!#';

const namesToTypes: { [key: string]: Function } = {};
const typesToNames = new Map<Function, string>();

function instantiate(type: Function, props: { [key: string]: any }) {

    let object = Object.create(type.prototype);
    for (var key in props) {
        if (key !== TYPE_KEY) {
            object[key] = props[key];
        }
    }

    return object;

}

function replacer(key: string, value: any) {

    if ((value as Object).constructor) {
        let name = typesToNames.get(value.constructor);
        if (name !== undefined) {
            return Object.assign({ [TYPE_KEY]: name }, value);
        }
    }

    return value;

}

function reviver(key: string, value: any) {

    if (typeof value === 'object' && typeof value[TYPE_KEY] === 'string') {
        let type = namesToTypes[value[TYPE_KEY]];
        if (type !== undefined) {
            return instantiate(type, value);
        }
    }

    return value;

}

function serialize(value: any) {
    return JSON.stringify(value, replacer);
}

function deserialize(text: string) {
    return JSON.parse(text, reviver);
}

function addType(name: string, type: Function) {

    if (name == null || name === '') {
        throw new Error('Could not add serializable type: Type has no name');
    }

    if (namesToTypes[name]) {
        throw new Error('Could not add serializable type: Type name "' + name + '" is already registered');
    }

    namesToTypes[name] = type;
    typesToNames.set(type, name);

}

export const Serializer = {
    serialize: serialize,
    deserialize: deserialize,
    addType: addType,
};

export function serializable() {
    return function (type: Function) {
        addType(type.name, type);
    };
}
