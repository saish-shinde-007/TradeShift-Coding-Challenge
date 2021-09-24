## How to run the TradeShift Amazing Co. Coding Challenge.

In the project directory, you can run:
### `docker-compose build --no-cache && docker-compose up`

Runs the react-app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Runs the node-app in the dev mode on http://localhost:3080 <br />
The page will reload if you make edits.<br />

## Regarding the Front-End Components
<img width="1433" alt="Screen Shot 2021-09-24 at 2 20 24 PM" src="https://user-images.githubusercontent.com/70448741/134745288-42deebe2-8299-4aa0-946a-8b7d3d051cb9.png">

### Get Original Tree
This sub-component gets the relation between all the nodes present in the n-ary tree and all of the node's descendants.

### List of Sub-Nodes
This sub-component gets the all of the specified node's descendants else it shows null if descendants are not present.

### Swap Parent Node
This sub-component swaps the Current Node with its parent Node if any. <br />
If the Parent Node is not present is gives an alert saying the parent Node is not present.

## Regarding the Back-End Components
The tree is read from a serialized file called data.txt and deserialized on server startup. <br />
This file works as the persistence layer for the tree changes.

### API Endpoint : /api/getTreeRelation
This API endpoint gets the tree relation for every node in the tree.

### API Endpoint : /api/getSubNodes
This API endpoint gets the descendants of a node.
 
### API Endpoint : /api/swapParentNode
This API endpoint swaps the given node with its parent. <br /> 
Whenever there is a change in the relationship of the tree we serialize the tree and push it to the disk file(data.txt) for persistence.
