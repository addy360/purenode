const handlers = require('../controllers')

const router = {}
router.ping = handlers.ping

router.users  = handlers.users

router._404 = handlers._404


exports.getHandler = pathname => {
    return pathname in router ? router[pathname] : router['_404']
}