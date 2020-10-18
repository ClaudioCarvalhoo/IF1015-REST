# Atividade REST

## Que decisões envolveram a escolha da nomenclatura dos recursos?

Tentei organizar de maneira que a nomenclatura deixasse claro o dado que cada recurso representa, assim como a quem ele pertence, seguindo o modelo `recurso/{id-do-recurso}/subrecurso/{id-do-subrecurso}`. No caso decidi que `characters` não seria um subrecurso de `animes` pois o percebo como uma entidade independente, que poderia ser relacionada a mais de um anime (por exemplo, no caso de adicionarmos a segunda temporada de algum dos animes já existentes no banco de dados).

## Que cabeçalhos HTTP estiveram envolvidos para garantir as quatro diretrizes acima?

A primeira diretriz foi garantida pelas URL's em si. A segunda pelo header `content-type`. A terceira pelos headers padrão. A quarta foi feita pelo body usando os campos de `links`.
