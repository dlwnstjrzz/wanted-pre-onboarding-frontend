import TodoItem from 'components/Todo/TodoItem';
import TodoList from 'components/Todo/TodoList';
import useTodos from 'hooks/useTodos';
import { useState } from 'react';
import styled from 'styled-components';

export type TodoType = {
  isCompleted: boolean;
  todo: string;
  id: number;
};
function Todo() {
  const [newTodo, setNewTodo] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [modifyTodo, setModifyTodo] = useState<string>('');
  const access_token = localStorage.getItem('token');
  const { todos, addTodo, editTodo, deleteTodo, toggleTodo } = useTodos(access_token);

  const handleToggleComplete = async (id: number, index: number) => {
    await toggleTodo(id, index);
  };

  const handleAddTodo = async () => {
    if (!newTodo) return;
    const inputData = { todo: newTodo };
    await addTodo(inputData);
    setNewTodo('');
  };

  const handleDeleteTodo = async (id: number, index: number) => {
    await deleteTodo(id, index);
  };

  const handleEditTodo = (index: number) => {
    setIsEditMode(true);
    setEditIndex(index);
    setModifyTodo(todos[index].todo);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditIndex(-1);
  };

  const handleSubmitEdit = async (id: number, index: number) => {
    await editTodo(id, index, modifyTodo);
    setIsEditMode(false);
    setEditIndex(-1);
    setNewTodo('');
  };

  const handleModifyTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModifyTodo(e.target.value);
  };

  function withTodos(Component: React.ComponentType<any>) {
    return function WithTodos(props: any) {
      return <Component todos={todos} {...props} />;
    };
  }
  const TodoItemWithTodos = withTodos(TodoItem);

  return (
    <TodoContainer>
      <InputConatiner>
        <NewTodoInput
          data-testid="new-todo-input"
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={isEditMode}
        />
        <NewTodoAddButton data-testid="new-todo-add-button" onClick={handleAddTodo}>
          추가
        </NewTodoAddButton>
      </InputConatiner>
      <TodoList todos={todos}>
        <TodoItemWithTodos
          setModifyTodo={setModifyTodo}
          handleToggleComplete={handleToggleComplete}
          handleModifyTodo={handleModifyTodo}
          isEditMode={isEditMode}
          editIndex={editIndex}
          modifyTodo={modifyTodo}
          handleSubmitEdit={handleSubmitEdit}
          handleCancelEdit={handleCancelEdit}
          handleEditTodo={handleEditTodo}
          handleDeleteTodo={handleDeleteTodo}
        />
      </TodoList>
    </TodoContainer>
  );
}

const NewTodoInput = styled.input`
  margin-right: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  font-size: 18px;
  width: 60%;
  max-width: 600px;
`;

const NewTodoAddButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  background-color: #0077cc;
  color: #fff;
  border: none;
  font-size: 18px;
`;
const InputConatiner = styled.div`
  margin-bottom: 35px;
  width: 100%;
  text-align: center;
`;
const TodoContainer = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  list-style: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
  margin: 50px auto;
`;

export default Todo;
