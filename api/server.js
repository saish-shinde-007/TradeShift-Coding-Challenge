const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express(),
      bodyParser = require('body-parser');
      port = 3080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../my-app/build')));

class Node {
    constructor(id, height, parent, children) {
        this.id = id;
        this.height = height;
        this.parent = parent;
        this.children = children;
    }
}

class Tree {
    constructor(data) {
        this.map = new Map();
        this._buildTree(data);
    }

    // Runtime O(N)
    getDescendants(id) {
        const cur = this.map.get(id);
        const descendants = [];
        const dfs = (root) => {
            if (!root) {
                return;
            }
            for (const child of root.children) {
                dfs(child);
            }
            descendants.push(root.id);
        };
        dfs(cur);
        // remove root node of descendants from list
        descendants.pop();
        return descendants;
    }

    // RunTime O(1)
    async swapWithParentNode(id) {
        const childNode = this.map.get(id);
        if (!childNode.parent) {
            return false;
        }
        const parentNode = this.map.get(childNode.parent);
        this.map.set(id, this.map.get(parentNode.id));
        this.map.set(parentNode.id, childNode);
        childNode.id = parentNode.id;
        childNode.parent = id;
        parentNode.id = id;
        // check if root node of tree has changed
        if (!childNode.parent) {
            this.root = childNode;
        }
        await this._persistTree();
        return true;
    }

    // Deserialize text file containing tree data.
    _buildTree(data) {
        const nodes = data.split(",");
        let i = 0;
        const dfs = (nodes, root, height) => {
            if (!nodes.length) {
                return;
            }
            const cur = new Node(nodes[i], height, root, []);
            if (!this.root) {
                this.root = cur;
            }
            this.map.set(nodes[i], cur);
            i++;
            const numChildren = nodes[i];
            i++;
            for (let i = 0; i < numChildren; i++) {
                cur.children.push(dfs(nodes, cur.id, height+1));
            }
            return cur;
        };
        return dfs(nodes, null, 0);
    }

    // we serialize the tree and push it to the disk file for peristence.
    async _persistTree() {
        const data = [];
        const dfs = (root) => {
            if (root == null) {
                data.push('&');
                return;
            }
            data.push(root.id);
            if (root.children.length > 0) {
                data.push(root.children.length);
                for (const child of root.children) {
                    dfs(child);
                }
            } else {
                data.push('&');
            }
        };
        dfs(this.root);

        await new Promise((resolve, reject) => {
            fs.writeFile(filename, data.join(','), (err) => {
                if (err) {
                    console.log('failed writing tree state to disk');
                    reject();
                }
                resolve();
            });
        });
    }
}

// Tree instance.
let tree;

const filename = 'data.txt';

async function readLog() {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, bytes) => {
            if (err) {
                reject(err);
            }
            resolve(Buffer.from(bytes).toString());
        });
    });
}

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../my-app/build/index.html'));
});

// Gets the entire TreeRelation Ship with every node
app.get('/api/getTreeRelation', async (req, res) => {
    let obj = {};
    for (let [key, value] of tree.map.entries()) {
        obj[key] = tree.getDescendants(key);
    }
    res.send(obj);
});

// Gets the descendants of a node
app.post('/api/getSubNodes', async (req, res) => {
    const id = req.body.node;
    const descendants = tree.getDescendants(id);
    res.json(descendants);
});

// Swaps the given node with its parent.
app.post('/api/swapParentNode', async (req, res) => {
    const id = req.body.nodeId;
    const sol = await tree.swapWithParentNode(id);
    res.json(sol);
});

// Reads the serialized tree from the data.txt file
(async () => {
    const transactions = await readLog('data.txt');
    tree = new Tree(transactions);
    console.log(`starting service on port ${port}`);
    app.listen(port);
})();
