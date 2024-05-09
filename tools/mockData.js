const fol = [
  {
    NodeID: 194424,
    Name: "Agency",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 6
  },
  {
    NodeID: 350273,
    Name: "anotherfolder",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 0
  },
  {
    NodeID: 196837,
    Name: "AnotherFolderWithRM",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 5
  },
  {
    NodeID: 30703,
    Name: "Business Admins Workspace",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 7
  },
  {
    NodeID: 256020,
    Name: "created thru rest wrapper",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 0
  },
  {
    NodeID: 4440,
    Name: "Email Filing Test",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 2
  },
  {
    NodeID: 204363,
    Name: "Extended Email Management Workspace",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 1694
  },
  {
    NodeID: 226079,
    Name:
      "Folder of Long path, like very very _ seriously long path. you can_t even phantom of how long this path is . seriously is there even such a long path in practice. it may be _ especially if its an email",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 24
  },
  {
    NodeID: 140158,
    Name: "Folder with many folders",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 35
  },
  {
    NodeID: 349943,
    Name: "folderWithCategory01",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 1
  },
  {
    NodeID: 181415,
    Name: "loadtest",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 4
  },
  {
    NodeID: 338723,
    Name: "sensitivitytest",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 1
  },
  {
    NodeID: 159864,
    Name: "testofficeonline-govt-tech",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 11
  },
  {
    NodeID: 192031,
    Name: "webreports",
    IconUri: null,
    ParentNodeID: 2000,
    NodeType: "Folder",
    ChildCount: 3
  }
];
const folders = {
  2000: [
    {
      NodeID: 194424,
      Name: "Agency",
      IconUri: null,
      ParentNodeID: 2000,
      NodeType: "Folder",
      ChildCount: 6
    }
  ]
};
const authors1 = [
  { id: 1, name: "Cory House" },
  { id: 2, name: "Scott Allen" },
  { id: 3, name: "Dan Wahlin" }
];

const authors = [
  { id: 1, name: "Cory House" },
  { id: 2, name: "Scott Allen" },
  { id: 3, name: "Dan Wahlin" }
];

const newCourse = {
  id: null,
  title: "",
  authorId: null,
  category: ""
};

// Using CommonJS style export so we can consume via Node (without using Babel-node)
module.exports = {
  newCourse,
  folders,
  authors,
  authors1
};
