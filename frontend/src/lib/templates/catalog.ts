import type { Template } from '../../backend';

const templateCatalog: Template[] = [
  {
    id: BigInt(1),
    name: 'Paper',
    description: 'Classic academic paper texture with warm neutral tones',
    previewImage: '/assets/generated/template-paper.dim_1600x2000.png',
  },
  {
    id: BigInt(2),
    name: 'Geometric',
    description: 'Modern geometric design with clean lines',
    previewImage: '/assets/generated/template-geo.dim_1600x2000.png',
  },
  {
    id: BigInt(3),
    name: 'Campus',
    description: 'Campus-inspired abstract background',
    previewImage: '/assets/generated/template-campus.dim_1600x2000.png',
  },
  {
    id: BigInt(4),
    name: 'Grid',
    description: 'Minimalist grid layout with monochrome palette',
    previewImage: '/assets/generated/template-grid.dim_1600x2000.png',
  },
];

export function getTemplateMetadata(): Template[] {
  return templateCatalog;
}

export function getTemplateById(id: bigint): Template | undefined {
  return templateCatalog.find((t) => t.id === id);
}
