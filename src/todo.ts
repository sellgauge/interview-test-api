/**
 * @swagger
 *
 * components:
 *  schemas:
 *      TodoItem:
 *          type: object
 *          properties:
 *              id:
 *                type: integer
 *                required: false
 *              title:
 *                type: string
 *                required: true
 *              done:
 *                type: boolean
 *                required: false
 *
 * /todo:
 *  get:
 *      summary: List all TODO items
 *      security:
 *        - ApiKeyAuth: []
 *      responses:
 *        200:
 *          description: List items
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/TodoItem'
 *  put:
 *      summary: Create a new TODO item
 *      security:
 *        - ApiKeyAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TodoItem'
 *      responses:
 *        200:
 *          description: Created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TodoItem'
 *
 * /todo/{id}:
 *  patch:
 *    summary: Update a TODO item
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        type: integer
 *    requestBody:
 *        required: true
 *        content:
 *            application/json:
 *                schema:
 *                    $ref: '#/components/schemas/TodoItem'
 *    responses:
 *      200:
 *        description: Created successfully
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TodoItem'
 *      404:
 *        description: Item not found
 *
 *  delete:
 *    summary: Delete a TODO item
 *    security:
 *      - ApiKeyAuth: []
 *    parameters:
 *      - name: id
 *        in: path
 *        type: integer
 *    responses:
 *      201:
 *        description: Successfully deleted
 *      404:
 *        description: Item not found
 */
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { checkSession } from "./auth";
import validate from "./validate";

interface ITodoItem {
  id: number;
  done: boolean;
  title: string;
}

const todoItems: { [key: number]: ITodoItem } = {};

let nextId = 1;

const todo = express();

todo.get("/", checkSession, (req: Request, res: Response) => {
  res.json(Object.values(todoItems));
});

todo.put(
  "/",
  checkSession,
  [body("title").not().isEmpty()],
  validate,
  (req: Request, res: Response) => {
    const done: boolean = req.body["done"] || false;

    const id = nextId++;

    const newItem: ITodoItem = {
      id,
      title: req.body["title"],
      done,
    };

    todoItems[id] = newItem;

    res.json(newItem);
  }
);

todo.patch(
  "/:id",
  checkSession,
  [param("id").isInt()],
  validate,
  (req: Request, res: Response) => {
    const id: number = parseInt(req.params["id"]);

    if (!todoItems[id])
      return res.status(404).json({ error: "Item not found" });

    const original = todoItems[id];

    const title = req.body["title"] || original.title;
    const done =
      req.body["done"] == undefined ? original.done : !!req.body["done"];

    todoItems[id] = {
      id,
      title,
      done,
    };

    res.json(todoItems[id]);
  }
);

todo.delete(
  "/:id",
  checkSession,
  [param("id").isInt()],
  validate,
  (req, res) => {
    const { id } = req.params;

    if (!todoItems[id])
      return res.status(404).json({ error: "Item not found" });

    delete todoItems[id];

    return res.status(201).send();
  }
);

export default todo;
