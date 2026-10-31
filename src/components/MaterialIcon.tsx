import { BatteryFull, Car, Droplet, FileText, GlassWater, Lightbulb, Package, Pill, Smartphone, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { MaterialId } from '../domain/types';

const ICONS: Record<MaterialId, LucideIcon> = {
  'pilhas-baterias': BatteryFull,
  eletronicos: Smartphone,
  lampadas: Lightbulb,
  'oleo-cozinha': Droplet,
  'papel-papelao': FileText,
  plastico: Package,
  vidro: GlassWater,
  metal: Wrench,
  medicamentos: Pill,
  automotivos: Car,
};

export function MaterialIcon({ id, size = 24 }: { id: MaterialId; size?: number }) {
  const Icon = ICONS[id];
  return <Icon aria-hidden="true" size={size} />;
}
