package com.example.ToDoList.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import com.example.ToDoList.Model.Todo;
import com.example.ToDoList.Service.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/todo")
public class TodoController {
    @Autowired
    private TodoService todoService;


    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    @PostMapping("/create")
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.createTodo(todo);
    }

    @GetMapping("/all")
    public List<Todo> getAllTodos() {
        return todoService.getAllTodos();
    }

    @GetMapping("{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable long id){
        return todoService.getTodoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        try {
            return ResponseEntity.ok(todoService.updateTodo(id, todo));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }



}
