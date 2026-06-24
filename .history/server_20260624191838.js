const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Working");
});

app.get("/test", (req, res) => {
  res.json({
    status: "success"
  });
});

const USER_ID = "palaksharma_24082005";
const EMAIL = "palak1368.be23@chitkarauniversity.edu.in";
const ROLL = "2311981368";

function buildTree(node, graph) {
  const children = graph[node] || [];
  const obj = {};

  for (const child of children) {
    obj[child] = buildTree(child, graph);
  }

  return obj;
}

function getDepth(node, graph) {
  const children = graph[node] || [];

  if (children.length === 0) return 1;

  let maxDepth = 0;

  for (const child of children) {
    maxDepth = Math.max(maxDepth, getDepth(child, graph));
  }

  return maxDepth + 1;
}

function detectCycle(node, graph, visiting, visited) {
  if (visiting.has(node)) return true;
  if (visited.has(node)) return false;

  visiting.add(node);

  for (const child of graph[node] || []) {
    if (detectCycle(child, graph, visiting, visited)) {
      return true;
    }
  }

  visiting.delete(node);
  visited.add(node);

  return false;
}

app.post("/bfhl", (req, res) => {
  const input = req.body.data || [];

  const invalid_entries = [];
  const duplicate_edges = [];

  const edgeSet = new Set();
  const graph = {};
  const childParent = {};

  for (let raw of input) {
    raw = String(raw).trim();

    const regex = /^[A-Z]->[A-Z]$/;

    if (!regex.test(raw)) {
      invalid_entries.push(raw);
      continue;
    }

    const [parent, child] = raw.split("->");

    if (parent === child) {
      invalid_entries.push(raw);
      continue;
    }

    if (edgeSet.has(raw)) {
      if (!duplicate_edges.includes(raw)) {
        duplicate_edges.push(raw);
      }
      continue;
    }

    edgeSet.add(raw);

    if (childParent[child]) {
      continue;
    }

    childParent[child] = parent;

    if (!graph[parent]) graph[parent] = [];
    if (!graph[child]) graph[child] = [];

    graph[parent].push(child);
  }

  const allNodes = new Set();

  Object.keys(graph).forEach((n) => allNodes.add(n));

  const roots = [...allNodes].filter(
    (node) => !Object.keys(childParent).includes(node)
  );

  const hierarchies = [];

  let total_trees = 0;
  let total_cycles = 0;

  let largest_tree_root = "";
  let largestDepth = 0;

  const visitedGlobal = new Set();

  for (const root of roots) {
    const cycle = detectCycle(
      root,
      graph,
      new Set(),
      new Set()
    );

    if (cycle) {
      total_cycles++;

      hierarchies.push({
        root,
        tree: {},
        has_cycle: true,
      });

      continue;
    }

    const tree = {};
    tree[root] = buildTree(root, graph);

    const depth = getDepth(root, graph);

    total_trees++;

    if (
      depth > largestDepth ||
      (depth === largestDepth &&
        root < largest_tree_root)
    ) {
      largestDepth = depth;
      largest_tree_root = root;
    }

    hierarchies.push({
      root,
      tree,
      depth,
    });

    visitedGlobal.add(root);
  }

  res.json({
    user_id: USER_ID,
    email_id: EMAIL,
    college_roll_number: ROLL,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}");
});