import { UserController } from "./controller/UserController";
import { StorageController } from "./controller/StorageController";
import { AddressController } from "./controller/AddressController";
import { PlaceController } from "./controller/PlaceController";
import { ProfessionalController } from "./controller/ProfessionalController";
import { ServiceController } from "./controller/ServiceController";
import { AgendaController } from "./controller/AgendaController";
import { ServiceProviderController } from "./controller/ServiceProviderController";
import { PromotionController } from "./controller/PromotionController";
import { NewsController } from "./controller/NewsController";
import { PointsController } from "./controller/PointsController";
import { CategoryController } from "./controller/CategoryController";
import { ProductController } from "./controller/ProductController";
import { PushController } from "./controller/PushController";
import { NotificationController } from "./controller/NotificationController";
import { AdminController } from "./controller/AdminController";
import { PlansController } from "./controller/PlansController";
import { SalesController } from "./controller/SalesController";

export const Routes = [
    { method: "get", route: "/users", controller: UserController, action: "all" },
    { method: "get", route: "/user/:id", controller: UserController, action: "one" },
    { method: "post", route: "/user", controller: UserController, action: "save" },
    { method: "post", route: "/user/create", controller: UserController, action: "createUser" },
    { method: "post", route: "/user/auth", controller: UserController, action: "auth" },
    { method: "post", route: "/user/authsocial", controller: UserController, action: "authSocial" },
    { method: "delete", route: "/user/:id", controller: UserController, action: "remove" },
    { method: "post", route: "/user/changepassword", controller: UserController, action: "changePassword" },
    { method: "post", route: "/user/forgotpassword", controller: UserController, action: "forgotPassword" },
    { method: "get", route: "/user/:id/agendas", controller: UserController, action: "getMyAgendas" },
    { method: "get", route: "/user/:id/finishedagendas", controller: UserController, action: "getMyFinishedAgendas" },
    { method: "get", route: "/user/:id/nonfinishedagendas", controller: UserController, action: "getMyNonFinishedAgendas" },
    { method: "get", route: "/user/:id/points/:sUid/serviceprovider", controller: UserController, action: "pointsPerUser" },


    { method: "get", route: "/serviceproviders", controller: ServiceProviderController, action: "all" },
    { method: "get", route: "/serviceproviders/:id", controller: ServiceProviderController, action: "one" },
    { method: "post", route: "/serviceproviders", controller: ServiceProviderController, action: "save" },
    { method: "post", route: "/serviceprovider/create", controller: ServiceProviderController, action: "createServiceProvider" },
    { method: "post", route: "/serviceprovider/save", controller: ServiceProviderController, action: "saveServiceProvider" },
    { method: "post", route: "/serviceprovider/auth", controller: ServiceProviderController, action: "auth" },
    { method: "delete", route: "/serviceproviders/:id", controller: ServiceProviderController, action: "remove" },
    { method: "post", route: "/serviceprovider/changepassword", controller: ServiceProviderController, action: "changePassword" },

    { method: "get", route: "/serviceprovider/:id/users", controller: ServiceProviderController, action: "getAllUsersPerPlace" },
    { method: "get", route: "/serviceprovider/:id/places", controller: ServiceProviderController, action: "getAllPlaces" },
    { method: "get", route: "/serviceprovider/:id/services", controller: ServiceProviderController, action: "getAllServices" },
    { method: "get", route: "/serviceprovider/:id/professionals", controller: ServiceProviderController, action: "getAllProfessionals" },
    { method: "get", route: "/serviceprovider/:id/promotions", controller: ServiceProviderController, action: "getAllPromotions" },
    { method: "get", route: "/serviceprovider/:id/news", controller: ServiceProviderController, action: "getAllNews" },
    { method: "get", route: "/serviceprovider/:id/categories", controller: ServiceProviderController, action: "getAllCategories" },
    { method: "get", route: "/serviceprovider/:id/products", controller: ServiceProviderController, action: "getAllProducts" },
    { method: "get", route: "/serviceprovider/:id/productsPromotion", controller: ServiceProviderController, action: "getAllProductsPromotion" },
    { method: "get", route: "/serviceprovider/:id/pushs", controller: ServiceProviderController, action: "getAllPushs" },
    { method: "get", route: "/serviceprovider/:id/notifications", controller: ServiceProviderController, action: "getAllNotifications" },
    { method: "get", route: "/serviceprovider/:id/notificationsReaden", controller: ServiceProviderController, action: "getAllNotificationsReaden" },
    { method: "get", route: "/serviceprovider/:id/transactions", controller: ServiceProviderController, action: "getAllTransactions" },

    { method: "get", route: "/serviceproviders/:id/city", controller: ServiceProviderController, action: "getPlacesPerCity" },


    { method: "get", route: "/serviceprovider/:id/count", controller: ServiceProviderController, action: "getCount" },

    { method: "get", route: "/promotions", controller: PromotionController, action: "all" },
    { method: "get", route: "/promotion/:id", controller: PromotionController, action: "one" },
    { method: "post", route: "/promotion", controller: PromotionController, action: "save" },
    { method: "delete", route: "/promotion/:id", controller: PromotionController, action: "remove" },

    { method: "get", route: "/notifications", controller: NotificationController, action: "all" },
    { method: "get", route: "/notifications/:id", controller: NotificationController, action: "one" },
    { method: "post", route: "/notifications", controller: NotificationController, action: "save" },
    { method: "delete", route: "/notifications/:id", controller: NotificationController, action: "remove" },


    { method: "get", route: "/places", controller: PlaceController, action: "all" },
    { method: "get", route: "/place/:id", controller: PlaceController, action: "one" },
    { method: "post", route: "/place", controller: PlaceController, action: "save" },
    { method: "delete", route: "/place/:id", controller: PlaceController, action: "remove" },
    { method: "get", route: "/place/:id/professionals", controller: PlaceController, action: "getProfessionalsPerPlace" },
    { method: "get", route: "/place/:id/services", controller: PlaceController, action: "getServicesPerPlace" },
    { method: "get", route: "/place/:id/promotions", controller: PlaceController, action: "getPromotionsPerPlace" },
    { method: "get", route: "/place/:id/city", controller: PlaceController, action: "getPlacesPerCity" },


    { method: "get", route: "/professionals", controller: ProfessionalController, action: "all" },
    { method: "get", route: "/professional/:id", controller: ProfessionalController, action: "one" },
    { method: "post", route: "/professional", controller: ProfessionalController, action: "save" },
    { method: "delete", route: "/professional/:id", controller: ProfessionalController, action: "remove" },

    { method: "get", route: "/news", controller: NewsController, action: "all" },
    { method: "get", route: "/news/:id", controller: NewsController, action: "one" },
    { method: "post", route: "/news", controller: NewsController, action: "save" },
    { method: "delete", route: "/news/:id", controller: NewsController, action: "remove" },

    { method: "get", route: "/categories", controller: CategoryController, action: "all" },
    { method: "get", route: "/category/:id", controller: CategoryController, action: "one" },
    { method: "post", route: "/category", controller: CategoryController, action: "save" },
    { method: "delete", route: "/category/:id", controller: CategoryController, action: "remove" },

    { method: "get", route: "/products", controller: ProductController, action: "all" },
    { method: "get", route: "/product/:id", controller: ProductController, action: "one" },
    { method: "post", route: "/product", controller: ProductController, action: "save" },
    { method: "delete", route: "/product/:id", controller: ProductController, action: "remove" },

    { method: "get", route: "/pushs", controller: PushController, action: "all" },
    { method: "get", route: "/push/:id", controller: PushController, action: "one" },
    { method: "post", route: "/push", controller: PushController, action: "save" },
    { method: "delete", route: "/push/:id", controller: PushController, action: "remove" },


    { method: "get", route: "/points", controller: PointsController, action: "all" },
    { method: "get", route: "/points/:id", controller: PointsController, action: "one" },
    { method: "post", route: "/points", controller: PointsController, action: "save" },
    { method: "delete", route: "/points/:id", controller: PointsController, action: "remove" },
    { method: "delete", route: "/points/:id/delete", controller: PointsController, action: "removePerAgenda" },


    { method: "get", route: "/services", controller: ServiceController, action: "all" },
    { method: "get", route: "/service/:id", controller: ServiceController, action: "one" },
    { method: "post", route: "/service", controller: ServiceController, action: "save" },
    { method: "delete", route: "/service/:id", controller: ServiceController, action: "remove" },
    { method: "get", route: "/service/:id/price", controller: ServiceController, action: "getPrice" },

    { method: "get", route: "/agendas", controller: AgendaController, action: "all" },
    { method: "get", route: "/agenda/:id", controller: AgendaController, action: "one" },
    { method: "post", route: "/agendaCancel/:id", controller: AgendaController, action: "updateAgenda" },
    { method: "post", route: "/agenda", controller: AgendaController, action: "save" },
    { method: "delete", route: "/agenda/:id", controller: AgendaController, action: "remove" },
    { method: "post", route: "/agenda/create", controller: AgendaController, action: "createAgenda" },
    { method: "get", route: "/agenda/:dia/horarios/:prof/professional", controller: AgendaController, action: "getHorarios" },
    { method: "get", route: "/agenda/:id/place", controller: AgendaController, action: "getHorariosPlace" },
    { method: "get", route: "/agenda/:id/serviceprovider", controller: AgendaController, action: "getHorariosServiceProvider" },



    { method: "get", route: "/storage/:filename", controller: StorageController, action: "getFile" },

    { method: "get", route: "/address/", controller: AddressController, action: "getAllStates" },
    { method: "get", route: "/address/:state", controller: AddressController, action: "getAllCities" },


    { method: "post", route: "/admin/auth", controller: AdminController, action: "auth" },
    { method: "post", route: "/admin/changepassword", controller: AdminController, action: "changePassword" },
    { method: "get", route: "/admin/clients", controller: AdminController, action: "allClients" },
    { method: "get", route: "/admin/users", controller: AdminController, action: "allUsers" },
    { method: "get", route: "/admin/news", controller: AdminController, action: "allNews" },
    { method: "get", route: "/admin/plans", controller: AdminController, action: "allPlans" },
    { method: "get", route: "/admin/promotions", controller: AdminController, action: "allPromotions" },


    { method: "get", route: "/plans", controller: PlansController, action: "all" },
    { method: "get", route: "/plan/:id", controller: PlansController, action: "one" },
    { method: "post", route: "/plan", controller: PlansController, action: "save" },
    { method: "delete", route: "/plan/:id", controller: PlansController, action: "remove" },

    { method: "get", route: "/sales", controller: SalesController, action: "all" },
    { method: "get", route: "/sale/:id", controller: SalesController, action: "one" },
    { method: "post", route: "/sale", controller: SalesController, action: "save" },
    { method: "post", route: "/sale/processdata", controller: SalesController, action: "processData" },
    { method: "delete", route: "/sale/:id", controller: SalesController, action: "remove" },


    { method: "post", route: "/sales/getid", controller: SalesController, action: "getSessionId" },
    { method: "post", route: "/sales/checktransaction", controller: SalesController, action: "checkTransaction" },






];