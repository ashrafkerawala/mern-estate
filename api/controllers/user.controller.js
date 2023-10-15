const base = (req, res) => {
    res.json({
        message: "Hello World"
    })
}

const test = (req, res) => {
    res.json({
        message: "Hello Test"
    })
};

export { base, test }