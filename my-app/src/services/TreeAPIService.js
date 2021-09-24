export async function getSubNodes(data) {
    try{
        const response = await fetch(`/api/getSubNodes`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({node: data})
        });
        return await response.json();
    } catch(error) {
        return [];
    }
}

export async function swapParentNode(data) {
    try{
        const response = await fetch(`/api/swapParentNode`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nodeId: data})
        });
        return await response.json();
    } catch(error) {
        return [];
    }
}

export async function getTreeRelation() {
    const response = await fetch(`/api/getTreeRelation`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    });
    return await response.json();
}
