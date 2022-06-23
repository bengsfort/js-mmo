import { Vector2 } from "../../math";
import { Node2D } from "../node2d";

describe("Node2D", () => {
  describe("ownership", () => {
    type NodeEventType = [parent: Node2D, child: Node2D];

    it("should contain references for children and parent nodes", () => {
      const root = new Node2D();
      const child1 = new Node2D();
      const child2 = new Node2D();
      const child3 = new Node2D();

      expect(root.parent).toBe(null);
      expect(root.childrenCount).toEqual(0);

      root.addChild(child1);
      child1.addChild(child2);
      child1.addChild(child3);

      // Check root...
      expect(root.children.length).toEqual(1);
      expect(root.childrenCount).toEqual(1);
      expect(root.children[0].id).toEqual(child1.id);

      // Check child1...
      expect(child1.parent?.id).toEqual(root.id);
      expect(child1.childrenCount).toEqual(2);
      expect(child1.children[0].id).toEqual(child2.id);
      expect(child1.children[1].id).toEqual(child3.id);

      // Check child2...
      expect(child2.parent?.id).toEqual(child1.id);
      expect(child3.parent?.id).toEqual(child1.id);
    });

    it("should emit an event whenever a child or parent is added/removed", () => {
      const nodeAdded = jest.fn();
      const nodeRemoved = jest.fn();

      const shouldNotTrigger = jest.fn();

      const root = new Node2D();
      root.on("node_added", nodeAdded);
      root.on("node_removed", nodeRemoved);

      const child = new Node2D();
      child.on("node_added", shouldNotTrigger);
      child.on("node_removed", shouldNotTrigger);

      // Make sure we get the added event.
      root.addChild(child);
      expect(nodeAdded).toHaveBeenCalledTimes(1);
      expect(nodeAdded).toHaveBeenCalledWith<NodeEventType>(root, child);

      // Make sure we get the removed event.
      root.remove(child);
      expect(nodeRemoved).toHaveBeenCalledTimes(1);
      expect(nodeRemoved).toHaveBeenCalledWith<NodeEventType>(root, child);

      // Ensure the child didnt get any events.
      expect(shouldNotTrigger).not.toHaveBeenCalled();
    });

    it("should bubble events upwards from children/grandchildren", () => {
      const nodeAdded = jest.fn();
      const nodeRemoved = jest.fn();

      const root = new Node2D();
      root.on("node_added", nodeAdded);
      root.on("node_removed", nodeRemoved);

      const child = new Node2D();
      root.addChild(child);
      expect(nodeAdded).toHaveBeenCalledTimes(1);
      expect(nodeAdded).toHaveBeenLastCalledWith<NodeEventType>(root, child);

      const grandchild = new Node2D();
      child.addChild(grandchild);
      expect(nodeAdded).toHaveBeenCalledTimes(2);
      expect(nodeAdded).toHaveBeenLastCalledWith<NodeEventType>(child, grandchild);

      grandchild.remove();
      expect(nodeRemoved).toHaveBeenCalledTimes(1);
      expect(nodeRemoved).toHaveBeenLastCalledWith<NodeEventType>(child, grandchild);
    });

    it("should not bubble events horizontally", () => {
      const nodeAdded = jest.fn();
      const shouldNotTrigger = jest.fn();

      const root = new Node2D();
      const left = new Node2D();
      const right = new Node2D();

      root.addChild(left, right);
      root.on("node_added", nodeAdded);
      left.on("node_added", shouldNotTrigger);

      // Add a child to right and it should bubble to root
      const grandchild = new Node2D();
      right.addChild(grandchild);
      expect(nodeAdded).toHaveBeenCalledTimes(1);
      expect(nodeAdded).toHaveBeenLastCalledWith<NodeEventType>(right, grandchild);

      // But left should not know
      expect(shouldNotTrigger).not.toHaveBeenCalled();
    });

    it("should remove any event listeners if a child gets removed", () => {
      const shouldTriggerOnce = jest.fn();

      const root = new Node2D();
      const removedChild = new Node2D();

      // Since it isn't added yet, there should be only be the initial node listener.
      expect(removedChild.transform.listenerCount("child_added")).toEqual(1);

      // Add the node.
      root.on("node_added", shouldTriggerOnce);
      root.addChild(removedChild);

      // Check node_added was called once and that there is a listener.
      expect(shouldTriggerOnce).toHaveBeenCalledTimes(1);
      expect(removedChild.transform.listenerCount("child_added")).toEqual(2);

      // Remove the child and ensure the count has gone down.
      root.remove(removedChild);
      expect(removedChild.transform.listenerCount("child_added")).toEqual(1);

      // Add a child to the removed node and ensure the root does not get notified.
      const grandchild = new Node2D();
      removedChild.addChild(grandchild);
      expect(shouldTriggerOnce).toHaveBeenCalledTimes(1);
    });
  });

  describe("activity", () => {
    it("should emit an event when switching from active to inactive", () => {
      const node = new Node2D();
      expect(node.active).toEqual(true);

      const listener = jest.fn();
      node.on("on_active", listener);

      node.active = false;
      expect(listener).lastCalledWith<[boolean, Node2D]>(false, node);
      expect(listener).toHaveBeenCalledTimes(1);

      // shouldnt triggee if not changing
      node.active = false;
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("should bubble activity events", () => {
      const node = new Node2D();
      const listener = jest.fn();
      node.on("on_active", listener);

      const child = new Node2D();
      node.addChild(child);
      child.active = false;
      expect(listener).lastCalledWith<[boolean, Node2D]>(false, child);
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe("transform integration", () => {
    it("should have a transform with position and scale", () => {
      const pos = new Vector2(5, 5);
      const scale = new Vector2(1.5, 1.5);

      const node = new Node2D();
      node.position.set(pos.x, pos.y);
      node.scale.set(scale.x, scale.y);
      node.rotation = 5;

      expect(node).toHaveProperty("transform");
      expect(node.transform.position.toLiteral()).toEqual(pos.toLiteral());
      expect(node.transform.scale.toLiteral()).toEqual(scale.toLiteral());
    });

    it("should expose world space position", () => {
      const root = new Node2D();
      const child = new Node2D();

      root.addChild(child);

      // Check positions start 0'd
      expect(root.position.toLiteral()).toEqual({ x: 0, y: 0 });
      expect(child.position.toLiteral()).toEqual({ x: 0, y: 0 });
      expect(root.getWorldPosition().toLiteral()).toEqual({ x: 0, y: 0 });
      expect(child.getWorldPosition().toLiteral()).toEqual({ x: 0, y: 0 });

      // Update root position
      root.position.set(5, 5);
      expect(root.getWorldPosition().toLiteral()).toEqual({ x: 5, y: 5 });
      expect(child.position.toLiteral()).toEqual({ x: 0, y: 0 });
      expect(child.getWorldPosition().toLiteral()).toEqual({ x: 5, y: 5 });

      // Update child position
      child.position.set(2.5, 2.5);
      expect(root.getWorldPosition().toLiteral()).toEqual({ x: 5, y: 5 });
      expect(child.position.toLiteral()).toEqual({ x: 2.5, y: 2.5 });
      expect(child.getWorldPosition().toLiteral()).toEqual({ x: 7.5, y: 7.5 });
    });

    it("should expose world space scale", () => {
      const root = new Node2D();
      const child = new Node2D();

      root.addChild(child);

      // Check scales start 0'd
      expect(root.scale.toLiteral()).toEqual({ x: 1, y: 1 });
      expect(child.scale.toLiteral()).toEqual({ x: 1, y: 1 });
      expect(root.getWorldScale().toLiteral()).toEqual({ x: 1, y: 1 });
      expect(child.getWorldScale().toLiteral()).toEqual({ x: 1, y: 1 });

      // Update root scale
      root.scale.set(2, 2);
      expect(root.getWorldScale().toLiteral()).toEqual({ x: 2, y: 2 });
      expect(child.scale.toLiteral()).toEqual({ x: 1, y: 1 });
      expect(child.getWorldScale().toLiteral()).toEqual({ x: 2, y: 2 });

      // Update child scale
      child.scale.set(10, 10);
      expect(root.getWorldScale().toLiteral()).toEqual({ x: 2, y: 2 });
      expect(child.scale.toLiteral()).toEqual({ x: 10, y: 10 });
      expect(child.getWorldScale().toLiteral()).toEqual({ x: 20, y: 20 });
    });

    it("should expose world space rotation", () => {
      const root = new Node2D();
      const child = new Node2D();

      root.addChild(child);

      // Check rotations start 0'd
      expect(root.rotation).toEqual(0);
      expect(child.rotation).toEqual(0);
      expect(root.getWorldRotation()).toEqual(0);
      expect(child.getWorldRotation()).toEqual(0);

      // Update root rotation
      root.rotation = 45;
      expect(root.getWorldRotation()).toEqual(45);
      expect(child.rotation).toEqual(0);
      expect(child.getWorldRotation()).toEqual(45);

      // Update child rotation
      child.rotation = 45;
      expect(root.getWorldRotation()).toEqual(45);
      expect(child.rotation).toEqual(45);
      expect(child.getWorldRotation()).toEqual(90);
    });
  });
});
