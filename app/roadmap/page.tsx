import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Page() {
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Roadmap</h1>

      <div className="flex flex-col gap-2">
        <TodoItem checked>Add room dashboard</TodoItem>
        <TodoItem checked>Add room CRUD</TodoItem>
        <TodoItem checked>Create canvas editor</TodoItem>
        <TodoItem checked>Create items</TodoItem>
        <TodoItem checked>Delete items</TodoItem>
        <TodoItem checked>Move items</TodoItem>
        <TodoItem checked>Separate items into placed / available for placement</TodoItem>

        <TodoItem>Fix support for dark mode</TodoItem>
        <TodoItem>Multiple item edit / move / delete</TodoItem>
        <TodoItem>Implement item edit menu</TodoItem>
        <TodoItem>Add context menu</TodoItem>
        <TodoItem>Support Rotation</TodoItem>
        <TodoItem>Room Thumbnails</TodoItem>
        <TodoItem>Refactor</TodoItem>
        <TodoItem>Keyboard Shortcuts</TodoItem>
      </div>
    </div>
  );
}

type TodoItemProps = {
  children: React.ReactNode;
  checked?: boolean;
};

function TodoItem({ children, checked }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox checked={checked} /> <Label>{children}</Label>
    </div>
  );
}
