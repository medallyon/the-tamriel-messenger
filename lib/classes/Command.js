class Command
{
    constructor(meta)
    {
        if (!meta)
            throw new ReferenceError("'meta' cannot be null or undefined");

        if (!meta.name)
            throw new ReferenceError("'meta.name' cannot be null or undefined");

        this.name = meta.name;
        this.description = meta.description || "";
        this.alias = meta.alias || [];
        this.usage = meta.usage || "";
        this.permissions = meta.permissions || 900;
        this.system = meta.system || false;
    }

    run() { }
}

module.exports = Command;
