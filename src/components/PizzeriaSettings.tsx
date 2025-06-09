import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PizzeriaSettingsProps {
  store: any;
}

const PizzeriaSettings: React.FC<PizzeriaSettingsProps> = ({ store }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: store.pizzeriaInfo?.name || '',
    subtitle: store.pizzeriaInfo?.subtitle || '',
    logo: store.pizzeriaInfo?.logo || '',
    address: store.pizzeriaInfo?.address || '',
    phone: store.pizzeriaInfo?.phone || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await store.updatePizzeriaInfo(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-montserrat text-2xl font-bold text-white">Configurações da Pizzaria</h2>
      </div>

      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-montserrat text-xl font-bold text-white mb-4">
          Informações da Pizzaria
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Nome da Pizzaria</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              placeholder="Nome da pizzaria"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Subtítulo</label>
            <input
              type="text"
              required
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              placeholder="Slogan ou subtítulo"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Logo (URL da imagem)</label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              placeholder="https://exemplo.com/logo.png"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Deixe em branco para usar apenas o texto
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Endereço Completo</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              placeholder="Rua, número, bairro, cidade, estado"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-white font-medium mb-2">Telefone WhatsApp</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-lg glass text-white border border-white/20 focus:border-neon-cyan focus:outline-none"
              placeholder="+5511999999999"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Formato: +55 + DDD + número (ex: +5511999999999)
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="flex items-center space-x-2 gradient-primary px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
            >
              <Save className="w-5 h-5" />
              <span>Salvar Configurações</span>
            </button>
          </div>
        </form>

        {store.pizzeriaInfo?.address && store.pizzeriaInfo?.phone && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="font-montserrat text-lg font-bold text-white mb-3">
              Informações de Contato
            </h4>
            <div className="space-y-2 text-muted-foreground">
              <p><strong>Endereço:</strong> {store.pizzeriaInfo.address}</p>
              <p><strong>WhatsApp:</strong> {store.pizzeriaInfo.phone}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzeriaSettings;