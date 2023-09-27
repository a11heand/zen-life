/*
Filename: SophisticatedCode.js

This code demonstrates a sophisticated and complex implementation of a web application that generates a maze using a randomized Prim's algorithm and allows a player to navigate through it using arrow keys.

The maze is displayed on an HTML canvas, and the player is represented by a colored square. Walls are displayed as black lines, pathways as white lines, and the player's path as a colored line.

Please note that executing this code requires running it in a browser environment with an HTML canvas element.

Author: AI Assistant
Date: October 1, 2021
*/

// Mazegenerator class handles the generation of the maze
class MazeGenerator {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.maze = this.createEmptyMaze();
    this.stack = [];
  }

  createEmptyMaze() {
    const maze = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      maze[i] = new Array(this.cols).fill(1);
    }
    return maze;
  }

  generateMaze() {
    let currentCell = { row: 0, col: 0 };
    this.maze[currentCell.row][currentCell.col] = 0;
    this.stack.push(currentCell);

    while (this.stack.length) {
      const neighbors = this.getNeighbors(currentCell);

      if (neighbors.length) {
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.removeWall(currentCell, randomNeighbor);
        this.maze[randomNeighbor.row][randomNeighbor.col] = 0;
        this.stack.push(randomNeighbor);
        currentCell = randomNeighbor;
      } else {
        currentCell = this.stack.pop();
      }
    }

    return this.maze;
  }

  getNeighbors(cell) {
    const { row, col } = cell;
    const neighbors = [];

    if (row - 2 >= 0) neighbors.push({ row: row - 2, col });
    if (row + 2 < this.rows) neighbors.push({ row: row + 2, col });
    if (col - 2 >= 0) neighbors.push({ row, col: col - 2 });
    if (col + 2 < this.cols) neighbors.push({ row, col: col + 2 });

    return neighbors.filter(neighbor => this.maze[neighbor.row][neighbor.col] === 1);
  }

  removeWall(cellA, cellB) {
    const row = (cellA.row + cellB.row) / 2;
    const col = (cellA.col + cellB.col) / 2;
    this.maze[row][col] = 0;
  }
}

// MazeGame class handles the game logic
class MazeGame {
  constructor(canvasId, mazeSize) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.mazeSize = mazeSize;
    this.cellSize = this.canvas.width / mazeSize;
    this.playerPos = { row: 1, col: 1 };
    this.path = [{ row: 1, col: 1 }];
    this.maze = [];

    this.generateMaze();
    this.drawMaze();
    this.drawPlayer();

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  generateMaze() {
    const mazeGenerator = new MazeGenerator(this.mazeSize, this.mazeSize);
    this.maze = mazeGenerator.generateMaze();
  }

  drawMaze() {
    for (let row = 0; row < this.mazeSize; row++) {
      for (let col = 0; col < this.mazeSize; col++) {
        const cellValue = this.maze[row][col];

        if (cellValue === 1) { // Wall
          this.ctx.fillStyle = 'black';
          this.ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
        } else { // Pathway
          this.ctx.fillStyle = 'white';
          this.ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  }

  drawPlayer() {
    const { row, col } = this.playerPos;
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize);
  }

  handleKeyDown(event) {
    const { keyCode } = event;

    switch (keyCode) {
      case 37: // Left Arrow
        this.movePlayer(-1, 0);
        break;
      case 38: // Up Arrow
        this.movePlayer(0, -1);
        break;
      case 39: // Right Arrow
        this.movePlayer(1, 0);
        break;
      case 40: // Down Arrow
        this.movePlayer(0, 1);
        break;
    }
  }

  movePlayer(rowOffset, colOffset) {
    const newRow = this.playerPos.row + rowOffset;
    const newCol = this.playerPos.col + colOffset;

    if (this.maze[newRow][newCol] === 0) {
      this.playerPos.row = newRow;
      this.playerPos.col = newCol;
      this.path.push({ row: newRow, col: newCol });

      this.ctx.strokeStyle = 'blue';
      this.ctx.lineWidth = this.cellSize / 4;
      this.ctx.beginPath();

      for (let i = 0; i < this.path.length; i++) {
        const { row, col } = this.path[i];
        this.ctx.lineTo(col * this.cellSize + this.cellSize / 2, row * this.cellSize + this.cellSize / 2);
      }

      this.ctx.stroke();
      this.ctx.closePath();
    }

    if (newRow === this.mazeSize - 2 && newCol === this.mazeSize - 2) {
      alert('Congratulations! You reached the end of the maze.');
    }
  }
}

// Start the game
const game = new MazeGame('mazeCanvas', 21);
