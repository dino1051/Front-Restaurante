import { Users, ShieldCheck, ChefHat, Truck } from "lucide-react";

interface UserMetricsProps {
  totalEmpleados: number;
  totalAdministradores: number;
  totalCocina: number;
  totalDelivery: number;
}

export default function UserMetrics({
  totalEmpleados,
  totalAdministradores,
  totalCocina,
  totalDelivery,
}: UserMetricsProps) {
  const metricas = [
    {
      titulo: "Total de empleados",
      valor: totalEmpleados,
      icono: Users,
      color: "text-primary",
      fondo: "bg-primary-light",
    },
    {
      titulo: "Administradores",
      valor: totalAdministradores,
      icono: ShieldCheck,
      color: "text-purple-600",
      fondo: "bg-purple-100",
    },
    {
      titulo: "Cocina",
      valor: totalCocina,
      icono: ChefHat,
      color: "text-orange-600",
      fondo: "bg-orange-100",
    },
    {
      titulo: "Delivery",
      valor: totalDelivery,
      icono: Truck,
      color: "text-blue-600",
      fondo: "bg-blue-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metricas.map((metrica) => {
        const Icono = metrica.icono;

        return (
          <article
            key={metrica.titulo}
            className="rounded-2xl border border-border bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-text-muted">{metrica.titulo}</p>

              <div className={`rounded-xl p-2 ${metrica.fondo}`}>
                <Icono size={21} className={metrica.color} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-bold text-text-main">
              {metrica.valor}
            </p>
          </article>
        );
      })}
    </div>
  );
}
