(function () {
  $("#matrixForm").on("submit", (e) => {
    e.preventDefault();
    toggleLoader();

    let formData = new FormData();
    let indexFile = document.querySelector("#indexFile").files[0];
    let matrixFile = document.querySelector("#matrixFile").files[0];
    formData.append("index", indexFile, "index.csv");
    formData.append("matrix", matrixFile, "matrix.csv");

    axios({
      method: "POST",
      url: "./api/create-matrix",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
    })
      .then((res) => {
        createGraph(res);
        console.log(res);
        toggleLoader();
      })
      .catch((e) => {
        console.log(e);
        toggleLoader();
      });
  });

  function toggleLoader() {
    let loader = document.getElementById("loader");
    let cL = loader.classList;
    if (cL.contains("d-none")) {
      cL.remove("d-none");
    } else {
      cL.add("d-none");
    }
  }

  function createGraph(dataObject) {
    var zoom = d3.zoom().scaleExtent([1, 10]).on("zoom", zoomed);
    var svg = d3.select("svg").call(zoom),
      width = +svg.attr("width");
    height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function (d) {
          return d.id;
        })
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("tmp/data.json", function (error, graph) {
      if (error) throw error;

      var link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
          return Math.sqrt(d.value);
        });

      var node = svg
        .append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter()
        .append("circle")
        .attr("r", 7)
        .attr("fill", function (d) {
          return color(d.group);
        })
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

        node.append("title").text(function (d) {
          return d.id + " | start: " + d.start_date + " | end: " + d.end_date;
        });node.append("text").text(function (d) {
          return d.id;
        });
      node
        .append("span")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function (d) {
          return d.id;
        });

      simulation.nodes(graph.nodes).on("tick", ticked);

      simulation.force("link").links(graph.links);
      simulation.force("x", d3.forceX(width / 2).strength(0.15));
      simulation.force("y", d3.forceY(height / 2).strength(0.15));
      function ticked() {
        link
          .attr("x1", function (d) {
            return d.source.x;
          })
          .attr("y1", function (d) {
            return d.source.y;
          })
          .attr("x2", function (d) {
            return d.target.x;
          })
          .attr("y2", function (d) {
            return d.target.y;
          });

        node
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.y;
          });
      }
    });

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    function zoomed() {
      svg.attr("transform", d3.event.transform);
    }
  }
})();
