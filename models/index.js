import Categoria from './Categoria.js'
import Precio from './Precio.js'
import Propiedad from './Propiedad.js'
import Usuario from './Usuario.js'

Propiedad.belongsTo(Precio)
Propiedad.belongsTo(Categoria)
Propiedad.belongsTo(Usuario)

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}
