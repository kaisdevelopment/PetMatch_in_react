// supabase/functions/gerar-termo/index.ts
//
// O QUE ESSA FUNÇÃO FAZ:
// 1. Recebe os dados da adoção (adotante + pet) via POST
// 2. Monta o texto do Termo de Responsabilidade
// 3. Salva o termo como .txt no Supabase Storage (bucket "termos")
// 4. Grava um registro na tabela "termos_adocao" com a URL do arquivo
// 5. Retorna a URL pública do termo gerado
//
// POR QUÊ EDGE FUNCTION?
// Roda no servidor (Deno), não expõe a service_role key no frontend,
// e pode ser chamada com segurança pelo React.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Trata requisições OPTIONS (preflight CORS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { adocao_id, adotante, pet } = await req.json();

    // Valida campos obrigatórios
    if (!adocao_id || !adotante?.nome || !pet?.nome) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios: adocao_id, adotante.nome, pet.nome" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Monta o conteúdo do termo
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const conteudoTermo = `
TERMO DE RESPONSABILIDADE DE ADOÇÃO
=====================================
Data: ${dataAtual}
Número do processo: ${adocao_id}

ADOTANTE
--------
Nome: ${adotante.nome}
CPF: ${adotante.cpf ?? "Não informado"}
E-mail: ${adotante.email ?? "Não informado"}
Telefone: ${adotante.telefone ?? "Não informado"}

ANIMAL ADOTADO
--------------
Nome: ${pet.nome}
Espécie: ${pet.especie ?? "Não informado"}
Raça: ${pet.raca ?? "Não informado"}
Idade: ${pet.idade ?? "Não informado"}

CLÁUSULAS
---------
1. O adotante se compromete a oferecer ambiente seguro e saudável ao animal.
2. O adotante responsabiliza-se por consultas veterinárias regulares.
3. O animal não poderá ser repassado a terceiros sem comunicação prévia à ONG.
4. Em caso de impossibilidade de cuidado, o adotante deve devolver o animal à ONG.
5. Maus-tratos implicarão em rescisão imediata e medidas legais cabíveis.

Ao confirmar a adoção na plataforma PetMatch, o adotante declara estar ciente
e de acordo com todas as cláusulas acima.

=====================================
Documento gerado eletronicamente pela plataforma PetMatch
ID de verificação: ${adocao_id}
    `.trim();

    // Cria o cliente Supabase com a service_role (seguro pois está no servidor)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Define o caminho do arquivo no Storage
    const nomeArquivo = `termo_${adocao_id}_${Date.now()}.txt`;
    const caminhoStorage = `adocoes/${nomeArquivo}`;

    // Faz upload do termo para o bucket "termos"
    const { error: uploadError } = await supabase.storage
      .from("termos")
      .upload(caminhoStorage, new TextEncoder().encode(conteudoTermo), {
        contentType: 'text/plain; charset=utf-8',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Gera a URL pública do arquivo
    const { data: urlData } = supabase.storage
      .from("termos")
      .getPublicUrl(caminhoStorage);

    const urlPublica = urlData.publicUrl;

    // Grava registro na tabela termos_adocao
    const { error: dbError } = await supabase
      .from("termos_adocao")
      .insert({
        adocao_id,
        url_documento: urlPublica,
        nome_arquivo: nomeArquivo,
        gerado_em: new Date().toISOString(),
      });

    if (dbError) throw dbError;

    // Retorna sucesso com a URL do termo
    return new Response(
      JSON.stringify({
        success: true,
        url_termo: urlPublica,
        mensagem: "Termo de responsabilidade gerado com sucesso!",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
