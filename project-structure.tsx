export default function ProjectStructure() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Estructura del Proyecto</h1>
      <div className="bg-muted p-4 rounded-lg">
        <pre className="text-sm">
          {`calculadora-nutricional/
├── data/
│   ├── brands.json       # Información de marcas
│   ├── categories.json   # Categorías de alimentos
│   └── foods.json        # Datos de alimentos con información nutricional
├── index.html            # Archivo HTML principal
├── main.js               # Lógica JavaScript de la aplicación
└── style.css             # Estilos CSS`}
        </pre>
      </div>
    </div>
  )
}

