class Snake {
    constructor(initialPosition = [[5, 5]]) {
      this.body = [...initialPosition]; 
      this.direction = "RIGHT"; 
    }
  
    setDirection(newDirection) {
      const allowedDirections = {
        UP: ["LEFT", "RIGHT"],
        DOWN: ["LEFT", "RIGHT"],
        LEFT: ["UP", "DOWN"],
        RIGHT: ["UP", "DOWN"],
      };
  
      if (allowedDirections[this.direction].includes(newDirection)) {
        this.direction = newDirection;
      }
    }
  
    move() {
      const head = this.body[0];
      let newHead;
  
      switch (this.direction) {
        case "UP":
          newHead = [head[0], head[1] - 1];
          break;
        case "DOWN":
          newHead = [head[0], head[1] + 1];
          break;
        case "LEFT":
          newHead = [head[0] - 1, head[1]];
          break;
        case "RIGHT":
          newHead = [head[0] + 1, head[1]];
          break;
        default:
          return;
      }
  
      this.body.unshift(newHead);
      this.body.pop();
    }
  
    grow() {
      const tail = this.body[this.body.length - 1];
      this.body.push(tail);
    }

    hasCollided() {
      const [head, ...rest] = this.body;
      return rest.some(segment => segment[0] === head[0] && segment[1] === head[1]);
    }
  }
  
  export default Snake;
  