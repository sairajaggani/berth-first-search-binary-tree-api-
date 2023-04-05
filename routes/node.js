const router= require("express").Router()
const Node= require("../models/Node")
const Counter= require("../models/Counter")


//POST Node
router.post("/", (req, res) => {    
    
    Counter.findOneAndUpdate(
        {
            id: "counter"
        },
        {
            "$inc": {
                "sequence": 1
            }
        },
        {
            new: true
        },
        async (err, resp)=> {
            try{
                let sequenceId;
                if (resp==null) {
                    const newValue= new Counter({
                        id: "counter",
                        sequence: 0
                    })
                    newValue.save()
                    sequenceId= 0
                }
                else {
                    sequenceId= resp.sequence
                }
                const newNode = new Node({
                    id: sequenceId,
                    name: req.body.name,
                    children: []
                })
                const savedNode= await newNode.save()
                res.status(200).json(savedNode)

            }
            catch(err) {
                res.status(500).json(err)
            }
        }
    )
    
})
    

router.post("/child", async (req, res) => {

    Counter.findOneAndUpdate(
        {
            id: "counter"
        },
        {
            "$inc": {
                "sequence": 1
            }
        },
        {
            new: true
        },
        async (err, resp)=> {
            try{
                let sequenceId;
                if (resp==null) {
                    const newValue= new Counter({
                        id: "counter",
                        sequence: 0
                    })
                    newValue.save()
                    sequenceId= 0
                }
                else {
                    sequenceId= resp.sequence
                }

                const newChild= new Node({
                    id: sequenceId,
                    name: req.body.child,
                    children: []
                })
        
                const savedChild= await newChild.save()
        
                const updatedParent= await Node.findOneAndUpdate({name: req.body.parent}, {
                    $push: {
                        children: sequenceId
                    }
                })
                
                res.status(200).json(savedChild)

            }
            catch(err) {
                res.status(500).json(err)
            }
        }
    )

})

//GET ALL NODES
router.get("/", async (req, res) => {
    try {
        const Nodes= await Node.find()

        const headNode= Nodes[0]

        let queue=[];

        let ans=[]

        queue.push(headNode["id"])
        while (queue.length) {
            let curNode= queue.shift()
            if (curNode===-1) {
                ans.push(null)
            }
            else {
                ans.push(Nodes[curNode])
    
                if (Nodes[curNode]["children"].length==0) {
                    queue.push(-1)
                    queue.push(-1)
                }
                else if (Nodes[curNode]["children"].length==1) {
                    for (let i=0; i<Nodes[curNode]["children"].length; i++) {
                        queue.push(Nodes[curNode]["children"][i])
                    }
                    queue.push(-1)
                }
                else {
                    for (let i=0; i<Nodes[curNode]["children"].length; i++) {
                        queue.push(Nodes[curNode]["children"][i])
                    }
                }
            }
        }

        res.status(200).json(ans)
    } 
    catch(err) {
        res.status(500).json(err)
    }
})

//GET BFS FROM A NODE
router.get("/bfs/:name", async (req, res)=> {
    try {
        const Nodes= await Node.find()

        const headNode= await Node.findOne({name: req.params.name})

        let queue=[];

        let ans=[]

        queue.push(headNode["id"])
        while (queue.length) {
            let curNode= queue.shift()
            ans.push(Nodes[curNode])

            for (let i=0; i<Nodes[curNode]["children"].length; i++) {
                queue.push(Nodes[curNode]["children"][i])
            }
        }

        res.status(200).json(ans)
    } 
    catch(err) {
        res.status(500).json(err)
    }
})



module.exports= router