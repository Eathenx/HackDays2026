import { useEffect, useRef } from 'react';
import { supabase } from './config/supabaseClient';

export default function App() {
  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const probarConexionYGuardado = async () => {
      console.log('🔄 Iniciando prueba de guardado...');

      // 1. Probar inserción en la tabla 'categorias'
      const { data: categoriaData, error: categoriaError } = await supabase
        .from('categorias')
        .insert([
          { 
            nombre: 'Antojitos Locales', 
            slug: 'antojitos-locales', 
            icono: 'restaurant-icon' 
          }
        ])
        .select(); // .select() es necesario para que Supabase devuelva el registro creado (incluyendo el ID)

      if (categoriaError) {
        console.error('❌ Error al guardar en categorias:', categoriaError.message);
        return;
      }

      console.log('✅ Categoría guardada con éxito:', categoriaData);
      const categoriaId = categoriaData[0].id;

      // 2. Probar inserción en la tabla 'comercios' usando el ID obtenido
      const { data: comercioData, error: comercioError } = await supabase
        .from('comercios')
        .insert([
          {
            categoria_id: categoriaId,
            nombre_negocio: 'Gorditas El Pasaje',
            nombre_dueno: 'Juan Pérez',
            direccion: 'Calle Constitución #123, Centro Histórico',
            horario: '08:00 - 16:00',
            descripcion: 'Gorditas tradicionales cocinadas a la leña.',
            telefono: '6181234567',
            latitud: 24.02770000,
            longitud: -104.65320000,
            tags: ['gorditas', 'desayuno', 'tradicional'] // El array de texto se pasa como un array nativo de JS
          }
        ])
        .select();

      if (comercioError) {
        console.error('❌ Error al guardar en comercios:', comercioError.message);
        return;
      }

      console.log('✅ Comercio guardado con éxito:', comercioData);
      console.log('🎉 ¡Todas las pruebas de inserción pasaron correctamente!');
    };

    probarConexionYGuardado();
  }, []);

  return (
    <div>
      <h1>Revisa la consola del navegador (F12) para ver los resultados de la prueba.</h1>
    </div>
  );
}