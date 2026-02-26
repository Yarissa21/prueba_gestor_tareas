import { useState } from "react";
import { Plus, Trash2, Pencil, X, CheckCircle, RotateCcw } from "lucide-react";

type Estado = "pendiente" | "proceso" | "finalizado";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: Estado;
  approved: boolean;
  rejectCount: number;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dragInfo, setDragInfo] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState<Omit<Task, "id" | "approved" | "rejectCount">>({
    title: "",
    description: "",
    dueDate: "",
    status: "pendiente"
  });

  const columnas = [
    { key: "pendiente", titulo: "Pendiente" },
    { key: "proceso", titulo: "En proceso" },
    { key: "finalizado", titulo: "Finalizado" }
  ] as const;

  const abrirModalNueva = () => {
    setEditingTask(null);
    setForm({ title: "", description: "", dueDate: "", status: "pendiente" });
    setError("");
    setShowModal(true);
  };

  const abrirModalEditar = (task: Task) => {
    setEditingTask(task);
    setForm(task);
    setError("");
    setShowModal(true);
  };

  const validarCampos = () => {
    if (!form.title.trim()) return "El título es obligatorio";
    if (!form.description.trim()) return "La descripción es obligatoria";
    if (!form.dueDate) return "La fecha límite es obligatoria";
    return "";
  };

  const guardarTarea = () => {
    const mensaje = validarCampos();
    if (mensaje) return setError(mensaje);

    if (editingTask) {
      setTasks(tasks.map(t =>
        t.id === editingTask.id
          ? { ...form, id: editingTask.id, approved: editingTask.approved, rejectCount: editingTask.rejectCount }
          : t
      ));
    } else {
      setTasks([...tasks, { ...form, id: Date.now(), approved: false, rejectCount: 0 }]);
    }

    setShowModal(false);
  };

  const eliminarTarea = (id: number) =>
    setTasks(tasks.filter(t => t.id !== id));

  const onDragStart = (task: Task) => setDragInfo(task);

  const onDrop = (statusDestino: Estado) => {
    if (!dragInfo) return;
    setTasks(tasks.map(t =>
      t.id === dragInfo.id ? { ...t, status: statusDestino, approved: false } : t
    ));
    setDragInfo(null);
  };

  const rechazarTarea = (task: Task) => {
    setTasks(tasks.map(t =>
      t.id === task.id
        ? { ...t, status: "proceso", approved: false, rejectCount: t.rejectCount + 1 }
        : t
    ));
  };

  const aceptarTarea = (task: Task) => {
    setTasks(tasks.map(t =>
      t.id === task.id ? { ...t, approved: true } : t
    ));
  };

  const permitirDrop = (e: React.DragEvent) => e.preventDefault();

  return (
    <>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>

      <div className="min-h-screen p-6 relative z-10">

        <header className="flex justify-between items-center mb-6 text-white">
          <h1 className="text-2xl font-bold">Gestor de Tareas</h1>

          <button
            onClick={abrirModalNueva}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
          >
            <Plus size={18} />
            Agregar tarea
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columnas.map((col) => (
            <div
              key={col.key}
              onDrop={() => onDrop(col.key)}
              onDragOver={permitirDrop}
              className="bg-white/60 backdrop-blur-md rounded-xl p-4 min-h-[500px] shadow-lg"
            >
              <h2 className="font-semibold text-lg mb-4 text-gray-800">
                {col.titulo}
              </h2>

              <div className="space-y-3">
                {tasks.filter((t) => t.status === col.key).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => onDragStart(task)}
                    className="bg-white p-3 rounded-lg shadow space-y-2 cursor-move hover:scale-105 hover:shadow-lg animate-slide-right"
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-semibold">{task.title}</div>

                      <div className="flex flex-col items-end gap-1">
                        {task.rejectCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {task.rejectCount} rechazo{task.rejectCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {task.approved && (
                          <span className="text-green-600 text-xs font-semibold">
                            ✔ Aprobado
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">{task.description}</div>
                    <div className="text-xs text-gray-500">
                      Fecha límite: {task.dueDate}
                    </div>

                    <div className="flex gap-3 pt-2 flex-wrap">

                      {task.status === "finalizado" && !task.approved && (
                        <>
                          <button onClick={() => aceptarTarea(task)} className="flex items-center gap-1 text-green-600 text-sm hover:underline">
                            <CheckCircle size={14} /> Aceptar
                          </button>

                          <button onClick={() => rechazarTarea(task)} className="flex items-center gap-1 text-orange-600 text-sm hover:underline">
                            <RotateCcw size={14} /> Rechazar
                          </button>
                        </>
                      )}

                      {!task.approved && (
                        <button onClick={() => abrirModalEditar(task)} className="flex items-center gap-1 text-blue-600 text-sm hover:underline">
                          <Pencil size={14} /> Editar
                        </button>
                      )}

                      {task.approved && (
                        <button onClick={() => eliminarTarea(task.id)} className="flex items-center gap-1 text-red-600 text-sm hover:underline">
                          <Trash2 size={14} /> Eliminar
                        </button>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">

              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                <X />
              </button>

              <h2 className="text-xl font-semibold mb-4">
                {editingTask ? "Editar tarea" : "Nueva tarea"}
              </h2>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Título *"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <textarea
                  placeholder="Descripción *"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />

                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <button
                  onClick={guardarTarea}
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Guardar
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}