exports.graph = function (req, res) {
  let indexes = req.files.index[0].buffer.toString().split("\r\n");
  let matrix = req.files.matrix[0].buffer.toString().split("\r\n");

  indexes.shift();

  const nodes = [];
  const links = [];

  for (let i = 0; i < indexes.length; i++) {
    let tmp = indexes[i].split(",");
    nodes.push({
      id: tmp[0],
      start_date: tmp[1],
      end_date: tmp[2],
    });

    matrix[i] = matrix[i].split(",");
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] == 1) {
        links.push({
          source: nodes[nodes.findIndex((obj) => obj.id == i)].id,
          target: nodes[nodes.findIndex((obj) => obj.id == j)].id,
        });
      }
    }
  }
  let jsonToSend = {
    nodes: nodes,
    links: links,
  };
  return res.send(jsonToSend);
};
