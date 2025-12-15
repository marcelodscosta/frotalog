
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AssetCategory
 * 
 */
export type AssetCategory = $Result.DefaultSelection<Prisma.$AssetCategoryPayload>
/**
 * Model Asset
 * 
 */
export type Asset = $Result.DefaultSelection<Prisma.$AssetPayload>
/**
 * Model Supplier
 * 
 */
export type Supplier = $Result.DefaultSelection<Prisma.$SupplierPayload>
/**
 * Model Maintenance
 * 
 */
export type Maintenance = $Result.DefaultSelection<Prisma.$MaintenancePayload>
/**
 * Model MaintenanceDocument
 * 
 */
export type MaintenanceDocument = $Result.DefaultSelection<Prisma.$MaintenanceDocumentPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE'
};

export type Role = (typeof Role)[keyof typeof Role]


export const AssetType: {
  VEHICLE: 'VEHICLE',
  EQUIPMENT: 'EQUIPMENT'
};

export type AssetType = (typeof AssetType)[keyof typeof AssetType]


export const AssetOwnership: {
  OWN: 'OWN',
  THIRD: 'THIRD'
};

export type AssetOwnership = (typeof AssetOwnership)[keyof typeof AssetOwnership]


export const MaintenanceStatus: {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export type MaintenanceStatus = (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus]


export const MaintenanceType: {
  PREVENTIVE: 'PREVENTIVE',
  CORRECTIVE: 'CORRECTIVE',
  EMERGENCY: 'EMERGENCY'
};

export type MaintenanceType = (typeof MaintenanceType)[keyof typeof MaintenanceType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type AssetType = $Enums.AssetType

export const AssetType: typeof $Enums.AssetType

export type AssetOwnership = $Enums.AssetOwnership

export const AssetOwnership: typeof $Enums.AssetOwnership

export type MaintenanceStatus = $Enums.MaintenanceStatus

export const MaintenanceStatus: typeof $Enums.MaintenanceStatus

export type MaintenanceType = $Enums.MaintenanceType

export const MaintenanceType: typeof $Enums.MaintenanceType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.assetCategory`: Exposes CRUD operations for the **AssetCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AssetCategories
    * const assetCategories = await prisma.assetCategory.findMany()
    * ```
    */
  get assetCategory(): Prisma.AssetCategoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.asset`: Exposes CRUD operations for the **Asset** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Assets
    * const assets = await prisma.asset.findMany()
    * ```
    */
  get asset(): Prisma.AssetDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.supplier`: Exposes CRUD operations for the **Supplier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Suppliers
    * const suppliers = await prisma.supplier.findMany()
    * ```
    */
  get supplier(): Prisma.SupplierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenance`: Exposes CRUD operations for the **Maintenance** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Maintenances
    * const maintenances = await prisma.maintenance.findMany()
    * ```
    */
  get maintenance(): Prisma.MaintenanceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.maintenanceDocument`: Exposes CRUD operations for the **MaintenanceDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MaintenanceDocuments
    * const maintenanceDocuments = await prisma.maintenanceDocument.findMany()
    * ```
    */
  get maintenanceDocument(): Prisma.MaintenanceDocumentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.15.0
   * Query Engine version: 85179d7826409ee107a6ba334b5e305ae3fba9fb
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    AssetCategory: 'AssetCategory',
    Asset: 'Asset',
    Supplier: 'Supplier',
    Maintenance: 'Maintenance',
    MaintenanceDocument: 'MaintenanceDocument'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "assetCategory" | "asset" | "supplier" | "maintenance" | "maintenanceDocument"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AssetCategory: {
        payload: Prisma.$AssetCategoryPayload<ExtArgs>
        fields: Prisma.AssetCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>
          }
          findFirst: {
            args: Prisma.AssetCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>
          }
          findMany: {
            args: Prisma.AssetCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>[]
          }
          create: {
            args: Prisma.AssetCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>
          }
          createMany: {
            args: Prisma.AssetCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>[]
          }
          delete: {
            args: Prisma.AssetCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>
          }
          update: {
            args: Prisma.AssetCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>
          }
          deleteMany: {
            args: Prisma.AssetCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssetCategoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>[]
          }
          upsert: {
            args: Prisma.AssetCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetCategoryPayload>
          }
          aggregate: {
            args: Prisma.AssetCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAssetCategory>
          }
          groupBy: {
            args: Prisma.AssetCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<AssetCategoryCountAggregateOutputType> | number
          }
        }
      }
      Asset: {
        payload: Prisma.$AssetPayload<ExtArgs>
        fields: Prisma.AssetFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AssetFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AssetFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findFirst: {
            args: Prisma.AssetFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AssetFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          findMany: {
            args: Prisma.AssetFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          create: {
            args: Prisma.AssetCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          createMany: {
            args: Prisma.AssetCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AssetCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          delete: {
            args: Prisma.AssetDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          update: {
            args: Prisma.AssetUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          deleteMany: {
            args: Prisma.AssetDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AssetUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AssetUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>[]
          }
          upsert: {
            args: Prisma.AssetUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AssetPayload>
          }
          aggregate: {
            args: Prisma.AssetAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAsset>
          }
          groupBy: {
            args: Prisma.AssetGroupByArgs<ExtArgs>
            result: $Utils.Optional<AssetGroupByOutputType>[]
          }
          count: {
            args: Prisma.AssetCountArgs<ExtArgs>
            result: $Utils.Optional<AssetCountAggregateOutputType> | number
          }
        }
      }
      Supplier: {
        payload: Prisma.$SupplierPayload<ExtArgs>
        fields: Prisma.SupplierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SupplierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SupplierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findFirst: {
            args: Prisma.SupplierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SupplierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          findMany: {
            args: Prisma.SupplierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          create: {
            args: Prisma.SupplierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          createMany: {
            args: Prisma.SupplierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SupplierCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          delete: {
            args: Prisma.SupplierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          update: {
            args: Prisma.SupplierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          deleteMany: {
            args: Prisma.SupplierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SupplierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SupplierUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>[]
          }
          upsert: {
            args: Prisma.SupplierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SupplierPayload>
          }
          aggregate: {
            args: Prisma.SupplierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSupplier>
          }
          groupBy: {
            args: Prisma.SupplierGroupByArgs<ExtArgs>
            result: $Utils.Optional<SupplierGroupByOutputType>[]
          }
          count: {
            args: Prisma.SupplierCountArgs<ExtArgs>
            result: $Utils.Optional<SupplierCountAggregateOutputType> | number
          }
        }
      }
      Maintenance: {
        payload: Prisma.$MaintenancePayload<ExtArgs>
        fields: Prisma.MaintenanceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>
          }
          findFirst: {
            args: Prisma.MaintenanceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>
          }
          findMany: {
            args: Prisma.MaintenanceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>[]
          }
          create: {
            args: Prisma.MaintenanceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>
          }
          createMany: {
            args: Prisma.MaintenanceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>[]
          }
          delete: {
            args: Prisma.MaintenanceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>
          }
          update: {
            args: Prisma.MaintenanceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaintenanceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>[]
          }
          upsert: {
            args: Prisma.MaintenanceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenancePayload>
          }
          aggregate: {
            args: Prisma.MaintenanceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenance>
          }
          groupBy: {
            args: Prisma.MaintenanceGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceCountAggregateOutputType> | number
          }
        }
      }
      MaintenanceDocument: {
        payload: Prisma.$MaintenanceDocumentPayload<ExtArgs>
        fields: Prisma.MaintenanceDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MaintenanceDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MaintenanceDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>
          }
          findFirst: {
            args: Prisma.MaintenanceDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MaintenanceDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>
          }
          findMany: {
            args: Prisma.MaintenanceDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>[]
          }
          create: {
            args: Prisma.MaintenanceDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>
          }
          createMany: {
            args: Prisma.MaintenanceDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MaintenanceDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>[]
          }
          delete: {
            args: Prisma.MaintenanceDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>
          }
          update: {
            args: Prisma.MaintenanceDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>
          }
          deleteMany: {
            args: Prisma.MaintenanceDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MaintenanceDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MaintenanceDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>[]
          }
          upsert: {
            args: Prisma.MaintenanceDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MaintenanceDocumentPayload>
          }
          aggregate: {
            args: Prisma.MaintenanceDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMaintenanceDocument>
          }
          groupBy: {
            args: Prisma.MaintenanceDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.MaintenanceDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<MaintenanceDocumentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    assetCategory?: AssetCategoryOmit
    asset?: AssetOmit
    supplier?: SupplierOmit
    maintenance?: MaintenanceOmit
    maintenanceDocument?: MaintenanceDocumentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type AssetCategoryCountOutputType
   */

  export type AssetCategoryCountOutputType = {
    Asset: number
  }

  export type AssetCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Asset?: boolean | AssetCategoryCountOutputTypeCountAssetArgs
  }

  // Custom InputTypes
  /**
   * AssetCategoryCountOutputType without action
   */
  export type AssetCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategoryCountOutputType
     */
    select?: AssetCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetCategoryCountOutputType without action
   */
  export type AssetCategoryCountOutputTypeCountAssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
  }


  /**
   * Count Type AssetCountOutputType
   */

  export type AssetCountOutputType = {
    Maintenance: number
  }

  export type AssetCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Maintenance?: boolean | AssetCountOutputTypeCountMaintenanceArgs
  }

  // Custom InputTypes
  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCountOutputType
     */
    select?: AssetCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AssetCountOutputType without action
   */
  export type AssetCountOutputTypeCountMaintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceWhereInput
  }


  /**
   * Count Type SupplierCountOutputType
   */

  export type SupplierCountOutputType = {
    Maintenance: number
  }

  export type SupplierCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Maintenance?: boolean | SupplierCountOutputTypeCountMaintenanceArgs
  }

  // Custom InputTypes
  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SupplierCountOutputType
     */
    select?: SupplierCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SupplierCountOutputType without action
   */
  export type SupplierCountOutputTypeCountMaintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceWhereInput
  }


  /**
   * Count Type MaintenanceCountOutputType
   */

  export type MaintenanceCountOutputType = {
    documents: number
  }

  export type MaintenanceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | MaintenanceCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * MaintenanceCountOutputType without action
   */
  export type MaintenanceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceCountOutputType
     */
    select?: MaintenanceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MaintenanceCountOutputType without action
   */
  export type MaintenanceCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceDocumentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    password_hash: string | null
    role: $Enums.Role | null
    avatar: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    phone: string | null
    password_hash: string | null
    role: $Enums.Role | null
    avatar: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    phone: number
    password_hash: number
    role: number
    avatar: number
    created_at: number
    updated_at: number
    is_Active: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password_hash?: true
    role?: true
    avatar?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password_hash?: true
    role?: true
    avatar?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    phone?: true
    password_hash?: true
    role?: true
    avatar?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    phone: string | null
    password_hash: string
    role: $Enums.Role
    avatar: string | null
    created_at: Date
    updated_at: Date
    is_Active: boolean
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    phone?: boolean
    password_hash?: boolean
    role?: boolean
    avatar?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "phone" | "password_hash" | "role" | "avatar" | "created_at" | "updated_at" | "is_Active", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      phone: string | null
      password_hash: string
      role: $Enums.Role
      avatar: string | null
      created_at: Date
      updated_at: Date
      is_Active: boolean
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
    readonly is_Active: FieldRef<"User", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model AssetCategory
   */

  export type AggregateAssetCategory = {
    _count: AssetCategoryCountAggregateOutputType | null
    _min: AssetCategoryMinAggregateOutputType | null
    _max: AssetCategoryMaxAggregateOutputType | null
  }

  export type AssetCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: $Enums.AssetType | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type AssetCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    type: $Enums.AssetType | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type AssetCategoryCountAggregateOutputType = {
    id: number
    name: number
    description: number
    type: number
    created_at: number
    updated_at: number
    is_Active: number
    _all: number
  }


  export type AssetCategoryMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type AssetCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type AssetCategoryCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    type?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    _all?: true
  }

  export type AssetCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetCategory to aggregate.
     */
    where?: AssetCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetCategories to fetch.
     */
    orderBy?: AssetCategoryOrderByWithRelationInput | AssetCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AssetCategories
    **/
    _count?: true | AssetCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetCategoryMaxAggregateInputType
  }

  export type GetAssetCategoryAggregateType<T extends AssetCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateAssetCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAssetCategory[P]>
      : GetScalarType<T[P], AggregateAssetCategory[P]>
  }




  export type AssetCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetCategoryWhereInput
    orderBy?: AssetCategoryOrderByWithAggregationInput | AssetCategoryOrderByWithAggregationInput[]
    by: AssetCategoryScalarFieldEnum[] | AssetCategoryScalarFieldEnum
    having?: AssetCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetCategoryCountAggregateInputType | true
    _min?: AssetCategoryMinAggregateInputType
    _max?: AssetCategoryMaxAggregateInputType
  }

  export type AssetCategoryGroupByOutputType = {
    id: string
    name: string
    description: string | null
    type: $Enums.AssetType
    created_at: Date
    updated_at: Date
    is_Active: boolean
    _count: AssetCategoryCountAggregateOutputType | null
    _min: AssetCategoryMinAggregateOutputType | null
    _max: AssetCategoryMaxAggregateOutputType | null
  }

  type GetAssetCategoryGroupByPayload<T extends AssetCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], AssetCategoryGroupByOutputType[P]>
        }
      >
    >


  export type AssetCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    Asset?: boolean | AssetCategory$AssetArgs<ExtArgs>
    _count?: boolean | AssetCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["assetCategory"]>

  export type AssetCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["assetCategory"]>

  export type AssetCategorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["assetCategory"]>

  export type AssetCategorySelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    type?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }

  export type AssetCategoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "type" | "created_at" | "updated_at" | "is_Active", ExtArgs["result"]["assetCategory"]>
  export type AssetCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Asset?: boolean | AssetCategory$AssetArgs<ExtArgs>
    _count?: boolean | AssetCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AssetCategoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AssetCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AssetCategory"
    objects: {
      Asset: Prisma.$AssetPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      type: $Enums.AssetType
      created_at: Date
      updated_at: Date
      is_Active: boolean
    }, ExtArgs["result"]["assetCategory"]>
    composites: {}
  }

  type AssetCategoryGetPayload<S extends boolean | null | undefined | AssetCategoryDefaultArgs> = $Result.GetResult<Prisma.$AssetCategoryPayload, S>

  type AssetCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetCategoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetCategoryCountAggregateInputType | true
    }

  export interface AssetCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AssetCategory'], meta: { name: 'AssetCategory' } }
    /**
     * Find zero or one AssetCategory that matches the filter.
     * @param {AssetCategoryFindUniqueArgs} args - Arguments to find a AssetCategory
     * @example
     * // Get one AssetCategory
     * const assetCategory = await prisma.assetCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetCategoryFindUniqueArgs>(args: SelectSubset<T, AssetCategoryFindUniqueArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AssetCategory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetCategoryFindUniqueOrThrowArgs} args - Arguments to find a AssetCategory
     * @example
     * // Get one AssetCategory
     * const assetCategory = await prisma.assetCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryFindFirstArgs} args - Arguments to find a AssetCategory
     * @example
     * // Get one AssetCategory
     * const assetCategory = await prisma.assetCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetCategoryFindFirstArgs>(args?: SelectSubset<T, AssetCategoryFindFirstArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AssetCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryFindFirstOrThrowArgs} args - Arguments to find a AssetCategory
     * @example
     * // Get one AssetCategory
     * const assetCategory = await prisma.assetCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AssetCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AssetCategories
     * const assetCategories = await prisma.assetCategory.findMany()
     * 
     * // Get first 10 AssetCategories
     * const assetCategories = await prisma.assetCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetCategoryWithIdOnly = await prisma.assetCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetCategoryFindManyArgs>(args?: SelectSubset<T, AssetCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AssetCategory.
     * @param {AssetCategoryCreateArgs} args - Arguments to create a AssetCategory.
     * @example
     * // Create one AssetCategory
     * const AssetCategory = await prisma.assetCategory.create({
     *   data: {
     *     // ... data to create a AssetCategory
     *   }
     * })
     * 
     */
    create<T extends AssetCategoryCreateArgs>(args: SelectSubset<T, AssetCategoryCreateArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AssetCategories.
     * @param {AssetCategoryCreateManyArgs} args - Arguments to create many AssetCategories.
     * @example
     * // Create many AssetCategories
     * const assetCategory = await prisma.assetCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetCategoryCreateManyArgs>(args?: SelectSubset<T, AssetCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AssetCategories and returns the data saved in the database.
     * @param {AssetCategoryCreateManyAndReturnArgs} args - Arguments to create many AssetCategories.
     * @example
     * // Create many AssetCategories
     * const assetCategory = await prisma.assetCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AssetCategories and only return the `id`
     * const assetCategoryWithIdOnly = await prisma.assetCategory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AssetCategory.
     * @param {AssetCategoryDeleteArgs} args - Arguments to delete one AssetCategory.
     * @example
     * // Delete one AssetCategory
     * const AssetCategory = await prisma.assetCategory.delete({
     *   where: {
     *     // ... filter to delete one AssetCategory
     *   }
     * })
     * 
     */
    delete<T extends AssetCategoryDeleteArgs>(args: SelectSubset<T, AssetCategoryDeleteArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AssetCategory.
     * @param {AssetCategoryUpdateArgs} args - Arguments to update one AssetCategory.
     * @example
     * // Update one AssetCategory
     * const assetCategory = await prisma.assetCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetCategoryUpdateArgs>(args: SelectSubset<T, AssetCategoryUpdateArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AssetCategories.
     * @param {AssetCategoryDeleteManyArgs} args - Arguments to filter AssetCategories to delete.
     * @example
     * // Delete a few AssetCategories
     * const { count } = await prisma.assetCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetCategoryDeleteManyArgs>(args?: SelectSubset<T, AssetCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AssetCategories
     * const assetCategory = await prisma.assetCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetCategoryUpdateManyArgs>(args: SelectSubset<T, AssetCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AssetCategories and returns the data updated in the database.
     * @param {AssetCategoryUpdateManyAndReturnArgs} args - Arguments to update many AssetCategories.
     * @example
     * // Update many AssetCategories
     * const assetCategory = await prisma.assetCategory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AssetCategories and only return the `id`
     * const assetCategoryWithIdOnly = await prisma.assetCategory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssetCategoryUpdateManyAndReturnArgs>(args: SelectSubset<T, AssetCategoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AssetCategory.
     * @param {AssetCategoryUpsertArgs} args - Arguments to update or create a AssetCategory.
     * @example
     * // Update or create a AssetCategory
     * const assetCategory = await prisma.assetCategory.upsert({
     *   create: {
     *     // ... data to create a AssetCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AssetCategory we want to update
     *   }
     * })
     */
    upsert<T extends AssetCategoryUpsertArgs>(args: SelectSubset<T, AssetCategoryUpsertArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AssetCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryCountArgs} args - Arguments to filter AssetCategories to count.
     * @example
     * // Count the number of AssetCategories
     * const count = await prisma.assetCategory.count({
     *   where: {
     *     // ... the filter for the AssetCategories we want to count
     *   }
     * })
    **/
    count<T extends AssetCategoryCountArgs>(
      args?: Subset<T, AssetCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AssetCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetCategoryAggregateArgs>(args: Subset<T, AssetCategoryAggregateArgs>): Prisma.PrismaPromise<GetAssetCategoryAggregateType<T>>

    /**
     * Group by AssetCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetCategoryGroupByArgs['orderBy'] }
        : { orderBy?: AssetCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AssetCategory model
   */
  readonly fields: AssetCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AssetCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Asset<T extends AssetCategory$AssetArgs<ExtArgs> = {}>(args?: Subset<T, AssetCategory$AssetArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AssetCategory model
   */
  interface AssetCategoryFieldRefs {
    readonly id: FieldRef<"AssetCategory", 'String'>
    readonly name: FieldRef<"AssetCategory", 'String'>
    readonly description: FieldRef<"AssetCategory", 'String'>
    readonly type: FieldRef<"AssetCategory", 'AssetType'>
    readonly created_at: FieldRef<"AssetCategory", 'DateTime'>
    readonly updated_at: FieldRef<"AssetCategory", 'DateTime'>
    readonly is_Active: FieldRef<"AssetCategory", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * AssetCategory findUnique
   */
  export type AssetCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * Filter, which AssetCategory to fetch.
     */
    where: AssetCategoryWhereUniqueInput
  }

  /**
   * AssetCategory findUniqueOrThrow
   */
  export type AssetCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * Filter, which AssetCategory to fetch.
     */
    where: AssetCategoryWhereUniqueInput
  }

  /**
   * AssetCategory findFirst
   */
  export type AssetCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * Filter, which AssetCategory to fetch.
     */
    where?: AssetCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetCategories to fetch.
     */
    orderBy?: AssetCategoryOrderByWithRelationInput | AssetCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetCategories.
     */
    cursor?: AssetCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetCategories.
     */
    distinct?: AssetCategoryScalarFieldEnum | AssetCategoryScalarFieldEnum[]
  }

  /**
   * AssetCategory findFirstOrThrow
   */
  export type AssetCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * Filter, which AssetCategory to fetch.
     */
    where?: AssetCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetCategories to fetch.
     */
    orderBy?: AssetCategoryOrderByWithRelationInput | AssetCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AssetCategories.
     */
    cursor?: AssetCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AssetCategories.
     */
    distinct?: AssetCategoryScalarFieldEnum | AssetCategoryScalarFieldEnum[]
  }

  /**
   * AssetCategory findMany
   */
  export type AssetCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * Filter, which AssetCategories to fetch.
     */
    where?: AssetCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AssetCategories to fetch.
     */
    orderBy?: AssetCategoryOrderByWithRelationInput | AssetCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AssetCategories.
     */
    cursor?: AssetCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AssetCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AssetCategories.
     */
    skip?: number
    distinct?: AssetCategoryScalarFieldEnum | AssetCategoryScalarFieldEnum[]
  }

  /**
   * AssetCategory create
   */
  export type AssetCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a AssetCategory.
     */
    data: XOR<AssetCategoryCreateInput, AssetCategoryUncheckedCreateInput>
  }

  /**
   * AssetCategory createMany
   */
  export type AssetCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AssetCategories.
     */
    data: AssetCategoryCreateManyInput | AssetCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AssetCategory createManyAndReturn
   */
  export type AssetCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * The data used to create many AssetCategories.
     */
    data: AssetCategoryCreateManyInput | AssetCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AssetCategory update
   */
  export type AssetCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a AssetCategory.
     */
    data: XOR<AssetCategoryUpdateInput, AssetCategoryUncheckedUpdateInput>
    /**
     * Choose, which AssetCategory to update.
     */
    where: AssetCategoryWhereUniqueInput
  }

  /**
   * AssetCategory updateMany
   */
  export type AssetCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AssetCategories.
     */
    data: XOR<AssetCategoryUpdateManyMutationInput, AssetCategoryUncheckedUpdateManyInput>
    /**
     * Filter which AssetCategories to update
     */
    where?: AssetCategoryWhereInput
    /**
     * Limit how many AssetCategories to update.
     */
    limit?: number
  }

  /**
   * AssetCategory updateManyAndReturn
   */
  export type AssetCategoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * The data used to update AssetCategories.
     */
    data: XOR<AssetCategoryUpdateManyMutationInput, AssetCategoryUncheckedUpdateManyInput>
    /**
     * Filter which AssetCategories to update
     */
    where?: AssetCategoryWhereInput
    /**
     * Limit how many AssetCategories to update.
     */
    limit?: number
  }

  /**
   * AssetCategory upsert
   */
  export type AssetCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the AssetCategory to update in case it exists.
     */
    where: AssetCategoryWhereUniqueInput
    /**
     * In case the AssetCategory found by the `where` argument doesn't exist, create a new AssetCategory with this data.
     */
    create: XOR<AssetCategoryCreateInput, AssetCategoryUncheckedCreateInput>
    /**
     * In case the AssetCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetCategoryUpdateInput, AssetCategoryUncheckedUpdateInput>
  }

  /**
   * AssetCategory delete
   */
  export type AssetCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
    /**
     * Filter which AssetCategory to delete.
     */
    where: AssetCategoryWhereUniqueInput
  }

  /**
   * AssetCategory deleteMany
   */
  export type AssetCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AssetCategories to delete
     */
    where?: AssetCategoryWhereInput
    /**
     * Limit how many AssetCategories to delete.
     */
    limit?: number
  }

  /**
   * AssetCategory.Asset
   */
  export type AssetCategory$AssetArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    cursor?: AssetWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * AssetCategory without action
   */
  export type AssetCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AssetCategory
     */
    select?: AssetCategorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the AssetCategory
     */
    omit?: AssetCategoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetCategoryInclude<ExtArgs> | null
  }


  /**
   * Model Asset
   */

  export type AggregateAsset = {
    _count: AssetCountAggregateOutputType | null
    _avg: AssetAvgAggregateOutputType | null
    _sum: AssetSumAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  export type AssetAvgAggregateOutputType = {
    year: number | null
  }

  export type AssetSumAggregateOutputType = {
    year: number | null
  }

  export type AssetMinAggregateOutputType = {
    id: string | null
    brand: string | null
    model: string | null
    year: number | null
    plate: string | null
    serial_number: string | null
    ownership: $Enums.AssetOwnership | null
    documentsUrl: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
    assetCategoryId: string | null
  }

  export type AssetMaxAggregateOutputType = {
    id: string | null
    brand: string | null
    model: string | null
    year: number | null
    plate: string | null
    serial_number: string | null
    ownership: $Enums.AssetOwnership | null
    documentsUrl: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
    assetCategoryId: string | null
  }

  export type AssetCountAggregateOutputType = {
    id: number
    brand: number
    model: number
    year: number
    plate: number
    serial_number: number
    ownership: number
    documentsUrl: number
    created_at: number
    updated_at: number
    is_Active: number
    assetCategoryId: number
    _all: number
  }


  export type AssetAvgAggregateInputType = {
    year?: true
  }

  export type AssetSumAggregateInputType = {
    year?: true
  }

  export type AssetMinAggregateInputType = {
    id?: true
    brand?: true
    model?: true
    year?: true
    plate?: true
    serial_number?: true
    ownership?: true
    documentsUrl?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    assetCategoryId?: true
  }

  export type AssetMaxAggregateInputType = {
    id?: true
    brand?: true
    model?: true
    year?: true
    plate?: true
    serial_number?: true
    ownership?: true
    documentsUrl?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    assetCategoryId?: true
  }

  export type AssetCountAggregateInputType = {
    id?: true
    brand?: true
    model?: true
    year?: true
    plate?: true
    serial_number?: true
    ownership?: true
    documentsUrl?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    assetCategoryId?: true
    _all?: true
  }

  export type AssetAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Asset to aggregate.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Assets
    **/
    _count?: true | AssetCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AssetAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AssetSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AssetMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AssetMaxAggregateInputType
  }

  export type GetAssetAggregateType<T extends AssetAggregateArgs> = {
        [P in keyof T & keyof AggregateAsset]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAsset[P]>
      : GetScalarType<T[P], AggregateAsset[P]>
  }




  export type AssetGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AssetWhereInput
    orderBy?: AssetOrderByWithAggregationInput | AssetOrderByWithAggregationInput[]
    by: AssetScalarFieldEnum[] | AssetScalarFieldEnum
    having?: AssetScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AssetCountAggregateInputType | true
    _avg?: AssetAvgAggregateInputType
    _sum?: AssetSumAggregateInputType
    _min?: AssetMinAggregateInputType
    _max?: AssetMaxAggregateInputType
  }

  export type AssetGroupByOutputType = {
    id: string
    brand: string
    model: string
    year: number | null
    plate: string | null
    serial_number: string | null
    ownership: $Enums.AssetOwnership
    documentsUrl: string | null
    created_at: Date
    updated_at: Date
    is_Active: boolean
    assetCategoryId: string
    _count: AssetCountAggregateOutputType | null
    _avg: AssetAvgAggregateOutputType | null
    _sum: AssetSumAggregateOutputType | null
    _min: AssetMinAggregateOutputType | null
    _max: AssetMaxAggregateOutputType | null
  }

  type GetAssetGroupByPayload<T extends AssetGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AssetGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AssetGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AssetGroupByOutputType[P]>
            : GetScalarType<T[P], AssetGroupByOutputType[P]>
        }
      >
    >


  export type AssetSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    brand?: boolean
    model?: boolean
    year?: boolean
    plate?: boolean
    serial_number?: boolean
    ownership?: boolean
    documentsUrl?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    assetCategoryId?: boolean
    assetCategory?: boolean | AssetCategoryDefaultArgs<ExtArgs>
    Maintenance?: boolean | Asset$MaintenanceArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    brand?: boolean
    model?: boolean
    year?: boolean
    plate?: boolean
    serial_number?: boolean
    ownership?: boolean
    documentsUrl?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    assetCategoryId?: boolean
    assetCategory?: boolean | AssetCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    brand?: boolean
    model?: boolean
    year?: boolean
    plate?: boolean
    serial_number?: boolean
    ownership?: boolean
    documentsUrl?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    assetCategoryId?: boolean
    assetCategory?: boolean | AssetCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["asset"]>

  export type AssetSelectScalar = {
    id?: boolean
    brand?: boolean
    model?: boolean
    year?: boolean
    plate?: boolean
    serial_number?: boolean
    ownership?: boolean
    documentsUrl?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    assetCategoryId?: boolean
  }

  export type AssetOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "brand" | "model" | "year" | "plate" | "serial_number" | "ownership" | "documentsUrl" | "created_at" | "updated_at" | "is_Active" | "assetCategoryId", ExtArgs["result"]["asset"]>
  export type AssetInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assetCategory?: boolean | AssetCategoryDefaultArgs<ExtArgs>
    Maintenance?: boolean | Asset$MaintenanceArgs<ExtArgs>
    _count?: boolean | AssetCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AssetIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assetCategory?: boolean | AssetCategoryDefaultArgs<ExtArgs>
  }
  export type AssetIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assetCategory?: boolean | AssetCategoryDefaultArgs<ExtArgs>
  }

  export type $AssetPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Asset"
    objects: {
      assetCategory: Prisma.$AssetCategoryPayload<ExtArgs>
      Maintenance: Prisma.$MaintenancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      brand: string
      model: string
      year: number | null
      plate: string | null
      serial_number: string | null
      ownership: $Enums.AssetOwnership
      documentsUrl: string | null
      created_at: Date
      updated_at: Date
      is_Active: boolean
      assetCategoryId: string
    }, ExtArgs["result"]["asset"]>
    composites: {}
  }

  type AssetGetPayload<S extends boolean | null | undefined | AssetDefaultArgs> = $Result.GetResult<Prisma.$AssetPayload, S>

  type AssetCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AssetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AssetCountAggregateInputType | true
    }

  export interface AssetDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Asset'], meta: { name: 'Asset' } }
    /**
     * Find zero or one Asset that matches the filter.
     * @param {AssetFindUniqueArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AssetFindUniqueArgs>(args: SelectSubset<T, AssetFindUniqueArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Asset that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AssetFindUniqueOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AssetFindUniqueOrThrowArgs>(args: SelectSubset<T, AssetFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Asset that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AssetFindFirstArgs>(args?: SelectSubset<T, AssetFindFirstArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Asset that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindFirstOrThrowArgs} args - Arguments to find a Asset
     * @example
     * // Get one Asset
     * const asset = await prisma.asset.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AssetFindFirstOrThrowArgs>(args?: SelectSubset<T, AssetFindFirstOrThrowArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Assets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Assets
     * const assets = await prisma.asset.findMany()
     * 
     * // Get first 10 Assets
     * const assets = await prisma.asset.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const assetWithIdOnly = await prisma.asset.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AssetFindManyArgs>(args?: SelectSubset<T, AssetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Asset.
     * @param {AssetCreateArgs} args - Arguments to create a Asset.
     * @example
     * // Create one Asset
     * const Asset = await prisma.asset.create({
     *   data: {
     *     // ... data to create a Asset
     *   }
     * })
     * 
     */
    create<T extends AssetCreateArgs>(args: SelectSubset<T, AssetCreateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Assets.
     * @param {AssetCreateManyArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AssetCreateManyArgs>(args?: SelectSubset<T, AssetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Assets and returns the data saved in the database.
     * @param {AssetCreateManyAndReturnArgs} args - Arguments to create many Assets.
     * @example
     * // Create many Assets
     * const asset = await prisma.asset.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AssetCreateManyAndReturnArgs>(args?: SelectSubset<T, AssetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Asset.
     * @param {AssetDeleteArgs} args - Arguments to delete one Asset.
     * @example
     * // Delete one Asset
     * const Asset = await prisma.asset.delete({
     *   where: {
     *     // ... filter to delete one Asset
     *   }
     * })
     * 
     */
    delete<T extends AssetDeleteArgs>(args: SelectSubset<T, AssetDeleteArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Asset.
     * @param {AssetUpdateArgs} args - Arguments to update one Asset.
     * @example
     * // Update one Asset
     * const asset = await prisma.asset.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AssetUpdateArgs>(args: SelectSubset<T, AssetUpdateArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Assets.
     * @param {AssetDeleteManyArgs} args - Arguments to filter Assets to delete.
     * @example
     * // Delete a few Assets
     * const { count } = await prisma.asset.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AssetDeleteManyArgs>(args?: SelectSubset<T, AssetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AssetUpdateManyArgs>(args: SelectSubset<T, AssetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Assets and returns the data updated in the database.
     * @param {AssetUpdateManyAndReturnArgs} args - Arguments to update many Assets.
     * @example
     * // Update many Assets
     * const asset = await prisma.asset.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Assets and only return the `id`
     * const assetWithIdOnly = await prisma.asset.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AssetUpdateManyAndReturnArgs>(args: SelectSubset<T, AssetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Asset.
     * @param {AssetUpsertArgs} args - Arguments to update or create a Asset.
     * @example
     * // Update or create a Asset
     * const asset = await prisma.asset.upsert({
     *   create: {
     *     // ... data to create a Asset
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Asset we want to update
     *   }
     * })
     */
    upsert<T extends AssetUpsertArgs>(args: SelectSubset<T, AssetUpsertArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Assets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetCountArgs} args - Arguments to filter Assets to count.
     * @example
     * // Count the number of Assets
     * const count = await prisma.asset.count({
     *   where: {
     *     // ... the filter for the Assets we want to count
     *   }
     * })
    **/
    count<T extends AssetCountArgs>(
      args?: Subset<T, AssetCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AssetCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AssetAggregateArgs>(args: Subset<T, AssetAggregateArgs>): Prisma.PrismaPromise<GetAssetAggregateType<T>>

    /**
     * Group by Asset.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AssetGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AssetGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AssetGroupByArgs['orderBy'] }
        : { orderBy?: AssetGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AssetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAssetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Asset model
   */
  readonly fields: AssetFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Asset.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AssetClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assetCategory<T extends AssetCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssetCategoryDefaultArgs<ExtArgs>>): Prisma__AssetCategoryClient<$Result.GetResult<Prisma.$AssetCategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    Maintenance<T extends Asset$MaintenanceArgs<ExtArgs> = {}>(args?: Subset<T, Asset$MaintenanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Asset model
   */
  interface AssetFieldRefs {
    readonly id: FieldRef<"Asset", 'String'>
    readonly brand: FieldRef<"Asset", 'String'>
    readonly model: FieldRef<"Asset", 'String'>
    readonly year: FieldRef<"Asset", 'Int'>
    readonly plate: FieldRef<"Asset", 'String'>
    readonly serial_number: FieldRef<"Asset", 'String'>
    readonly ownership: FieldRef<"Asset", 'AssetOwnership'>
    readonly documentsUrl: FieldRef<"Asset", 'String'>
    readonly created_at: FieldRef<"Asset", 'DateTime'>
    readonly updated_at: FieldRef<"Asset", 'DateTime'>
    readonly is_Active: FieldRef<"Asset", 'Boolean'>
    readonly assetCategoryId: FieldRef<"Asset", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Asset findUnique
   */
  export type AssetFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findUniqueOrThrow
   */
  export type AssetFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset findFirst
   */
  export type AssetFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findFirstOrThrow
   */
  export type AssetFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Asset to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Assets.
     */
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset findMany
   */
  export type AssetFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter, which Assets to fetch.
     */
    where?: AssetWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Assets to fetch.
     */
    orderBy?: AssetOrderByWithRelationInput | AssetOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Assets.
     */
    cursor?: AssetWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Assets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Assets.
     */
    skip?: number
    distinct?: AssetScalarFieldEnum | AssetScalarFieldEnum[]
  }

  /**
   * Asset create
   */
  export type AssetCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to create a Asset.
     */
    data: XOR<AssetCreateInput, AssetUncheckedCreateInput>
  }

  /**
   * Asset createMany
   */
  export type AssetCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Asset createManyAndReturn
   */
  export type AssetCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * The data used to create many Assets.
     */
    data: AssetCreateManyInput | AssetCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset update
   */
  export type AssetUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The data needed to update a Asset.
     */
    data: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
    /**
     * Choose, which Asset to update.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset updateMany
   */
  export type AssetUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to update.
     */
    limit?: number
  }

  /**
   * Asset updateManyAndReturn
   */
  export type AssetUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * The data used to update Assets.
     */
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyInput>
    /**
     * Filter which Assets to update
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Asset upsert
   */
  export type AssetUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * The filter to search for the Asset to update in case it exists.
     */
    where: AssetWhereUniqueInput
    /**
     * In case the Asset found by the `where` argument doesn't exist, create a new Asset with this data.
     */
    create: XOR<AssetCreateInput, AssetUncheckedCreateInput>
    /**
     * In case the Asset was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AssetUpdateInput, AssetUncheckedUpdateInput>
  }

  /**
   * Asset delete
   */
  export type AssetDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
    /**
     * Filter which Asset to delete.
     */
    where: AssetWhereUniqueInput
  }

  /**
   * Asset deleteMany
   */
  export type AssetDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Assets to delete
     */
    where?: AssetWhereInput
    /**
     * Limit how many Assets to delete.
     */
    limit?: number
  }

  /**
   * Asset.Maintenance
   */
  export type Asset$MaintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    where?: MaintenanceWhereInput
    orderBy?: MaintenanceOrderByWithRelationInput | MaintenanceOrderByWithRelationInput[]
    cursor?: MaintenanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MaintenanceScalarFieldEnum | MaintenanceScalarFieldEnum[]
  }

  /**
   * Asset without action
   */
  export type AssetDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Asset
     */
    select?: AssetSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Asset
     */
    omit?: AssetOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AssetInclude<ExtArgs> | null
  }


  /**
   * Model Supplier
   */

  export type AggregateSupplier = {
    _count: SupplierCountAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  export type SupplierMinAggregateOutputType = {
    id: string | null
    company_name: string | null
    trading_name: string | null
    cnpj: string | null
    email: string | null
    phone: string | null
    contact: string | null
    address: string | null
    city: string | null
    state: string | null
    zip_code: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type SupplierMaxAggregateOutputType = {
    id: string | null
    company_name: string | null
    trading_name: string | null
    cnpj: string | null
    email: string | null
    phone: string | null
    contact: string | null
    address: string | null
    city: string | null
    state: string | null
    zip_code: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type SupplierCountAggregateOutputType = {
    id: number
    company_name: number
    trading_name: number
    cnpj: number
    email: number
    phone: number
    contact: number
    address: number
    city: number
    state: number
    zip_code: number
    service_types: number
    created_at: number
    updated_at: number
    is_Active: number
    _all: number
  }


  export type SupplierMinAggregateInputType = {
    id?: true
    company_name?: true
    trading_name?: true
    cnpj?: true
    email?: true
    phone?: true
    contact?: true
    address?: true
    city?: true
    state?: true
    zip_code?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type SupplierMaxAggregateInputType = {
    id?: true
    company_name?: true
    trading_name?: true
    cnpj?: true
    email?: true
    phone?: true
    contact?: true
    address?: true
    city?: true
    state?: true
    zip_code?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type SupplierCountAggregateInputType = {
    id?: true
    company_name?: true
    trading_name?: true
    cnpj?: true
    email?: true
    phone?: true
    contact?: true
    address?: true
    city?: true
    state?: true
    zip_code?: true
    service_types?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    _all?: true
  }

  export type SupplierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Supplier to aggregate.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Suppliers
    **/
    _count?: true | SupplierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SupplierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SupplierMaxAggregateInputType
  }

  export type GetSupplierAggregateType<T extends SupplierAggregateArgs> = {
        [P in keyof T & keyof AggregateSupplier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSupplier[P]>
      : GetScalarType<T[P], AggregateSupplier[P]>
  }




  export type SupplierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SupplierWhereInput
    orderBy?: SupplierOrderByWithAggregationInput | SupplierOrderByWithAggregationInput[]
    by: SupplierScalarFieldEnum[] | SupplierScalarFieldEnum
    having?: SupplierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SupplierCountAggregateInputType | true
    _min?: SupplierMinAggregateInputType
    _max?: SupplierMaxAggregateInputType
  }

  export type SupplierGroupByOutputType = {
    id: string
    company_name: string
    trading_name: string | null
    cnpj: string
    email: string
    phone: string
    contact: string
    address: string | null
    city: string | null
    state: string | null
    zip_code: string | null
    service_types: string[]
    created_at: Date
    updated_at: Date
    is_Active: boolean
    _count: SupplierCountAggregateOutputType | null
    _min: SupplierMinAggregateOutputType | null
    _max: SupplierMaxAggregateOutputType | null
  }

  type GetSupplierGroupByPayload<T extends SupplierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SupplierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SupplierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SupplierGroupByOutputType[P]>
            : GetScalarType<T[P], SupplierGroupByOutputType[P]>
        }
      >
    >


  export type SupplierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_name?: boolean
    trading_name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    contact?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip_code?: boolean
    service_types?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    Maintenance?: boolean | Supplier$MaintenanceArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_name?: boolean
    trading_name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    contact?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip_code?: boolean
    service_types?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_name?: boolean
    trading_name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    contact?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip_code?: boolean
    service_types?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }, ExtArgs["result"]["supplier"]>

  export type SupplierSelectScalar = {
    id?: boolean
    company_name?: boolean
    trading_name?: boolean
    cnpj?: boolean
    email?: boolean
    phone?: boolean
    contact?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    zip_code?: boolean
    service_types?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }

  export type SupplierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "company_name" | "trading_name" | "cnpj" | "email" | "phone" | "contact" | "address" | "city" | "state" | "zip_code" | "service_types" | "created_at" | "updated_at" | "is_Active", ExtArgs["result"]["supplier"]>
  export type SupplierInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Maintenance?: boolean | Supplier$MaintenanceArgs<ExtArgs>
    _count?: boolean | SupplierCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SupplierIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SupplierIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SupplierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Supplier"
    objects: {
      Maintenance: Prisma.$MaintenancePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      company_name: string
      trading_name: string | null
      cnpj: string
      email: string
      phone: string
      contact: string
      address: string | null
      city: string | null
      state: string | null
      zip_code: string | null
      service_types: string[]
      created_at: Date
      updated_at: Date
      is_Active: boolean
    }, ExtArgs["result"]["supplier"]>
    composites: {}
  }

  type SupplierGetPayload<S extends boolean | null | undefined | SupplierDefaultArgs> = $Result.GetResult<Prisma.$SupplierPayload, S>

  type SupplierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SupplierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SupplierCountAggregateInputType | true
    }

  export interface SupplierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Supplier'], meta: { name: 'Supplier' } }
    /**
     * Find zero or one Supplier that matches the filter.
     * @param {SupplierFindUniqueArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SupplierFindUniqueArgs>(args: SelectSubset<T, SupplierFindUniqueArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Supplier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SupplierFindUniqueOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SupplierFindUniqueOrThrowArgs>(args: SelectSubset<T, SupplierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SupplierFindFirstArgs>(args?: SelectSubset<T, SupplierFindFirstArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Supplier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindFirstOrThrowArgs} args - Arguments to find a Supplier
     * @example
     * // Get one Supplier
     * const supplier = await prisma.supplier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SupplierFindFirstOrThrowArgs>(args?: SelectSubset<T, SupplierFindFirstOrThrowArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Suppliers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Suppliers
     * const suppliers = await prisma.supplier.findMany()
     * 
     * // Get first 10 Suppliers
     * const suppliers = await prisma.supplier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const supplierWithIdOnly = await prisma.supplier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SupplierFindManyArgs>(args?: SelectSubset<T, SupplierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Supplier.
     * @param {SupplierCreateArgs} args - Arguments to create a Supplier.
     * @example
     * // Create one Supplier
     * const Supplier = await prisma.supplier.create({
     *   data: {
     *     // ... data to create a Supplier
     *   }
     * })
     * 
     */
    create<T extends SupplierCreateArgs>(args: SelectSubset<T, SupplierCreateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Suppliers.
     * @param {SupplierCreateManyArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SupplierCreateManyArgs>(args?: SelectSubset<T, SupplierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Suppliers and returns the data saved in the database.
     * @param {SupplierCreateManyAndReturnArgs} args - Arguments to create many Suppliers.
     * @example
     * // Create many Suppliers
     * const supplier = await prisma.supplier.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SupplierCreateManyAndReturnArgs>(args?: SelectSubset<T, SupplierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Supplier.
     * @param {SupplierDeleteArgs} args - Arguments to delete one Supplier.
     * @example
     * // Delete one Supplier
     * const Supplier = await prisma.supplier.delete({
     *   where: {
     *     // ... filter to delete one Supplier
     *   }
     * })
     * 
     */
    delete<T extends SupplierDeleteArgs>(args: SelectSubset<T, SupplierDeleteArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Supplier.
     * @param {SupplierUpdateArgs} args - Arguments to update one Supplier.
     * @example
     * // Update one Supplier
     * const supplier = await prisma.supplier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SupplierUpdateArgs>(args: SelectSubset<T, SupplierUpdateArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Suppliers.
     * @param {SupplierDeleteManyArgs} args - Arguments to filter Suppliers to delete.
     * @example
     * // Delete a few Suppliers
     * const { count } = await prisma.supplier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SupplierDeleteManyArgs>(args?: SelectSubset<T, SupplierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SupplierUpdateManyArgs>(args: SelectSubset<T, SupplierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Suppliers and returns the data updated in the database.
     * @param {SupplierUpdateManyAndReturnArgs} args - Arguments to update many Suppliers.
     * @example
     * // Update many Suppliers
     * const supplier = await prisma.supplier.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Suppliers and only return the `id`
     * const supplierWithIdOnly = await prisma.supplier.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SupplierUpdateManyAndReturnArgs>(args: SelectSubset<T, SupplierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Supplier.
     * @param {SupplierUpsertArgs} args - Arguments to update or create a Supplier.
     * @example
     * // Update or create a Supplier
     * const supplier = await prisma.supplier.upsert({
     *   create: {
     *     // ... data to create a Supplier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Supplier we want to update
     *   }
     * })
     */
    upsert<T extends SupplierUpsertArgs>(args: SelectSubset<T, SupplierUpsertArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Suppliers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierCountArgs} args - Arguments to filter Suppliers to count.
     * @example
     * // Count the number of Suppliers
     * const count = await prisma.supplier.count({
     *   where: {
     *     // ... the filter for the Suppliers we want to count
     *   }
     * })
    **/
    count<T extends SupplierCountArgs>(
      args?: Subset<T, SupplierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SupplierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SupplierAggregateArgs>(args: Subset<T, SupplierAggregateArgs>): Prisma.PrismaPromise<GetSupplierAggregateType<T>>

    /**
     * Group by Supplier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SupplierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SupplierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SupplierGroupByArgs['orderBy'] }
        : { orderBy?: SupplierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SupplierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSupplierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Supplier model
   */
  readonly fields: SupplierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Supplier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SupplierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Maintenance<T extends Supplier$MaintenanceArgs<ExtArgs> = {}>(args?: Subset<T, Supplier$MaintenanceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Supplier model
   */
  interface SupplierFieldRefs {
    readonly id: FieldRef<"Supplier", 'String'>
    readonly company_name: FieldRef<"Supplier", 'String'>
    readonly trading_name: FieldRef<"Supplier", 'String'>
    readonly cnpj: FieldRef<"Supplier", 'String'>
    readonly email: FieldRef<"Supplier", 'String'>
    readonly phone: FieldRef<"Supplier", 'String'>
    readonly contact: FieldRef<"Supplier", 'String'>
    readonly address: FieldRef<"Supplier", 'String'>
    readonly city: FieldRef<"Supplier", 'String'>
    readonly state: FieldRef<"Supplier", 'String'>
    readonly zip_code: FieldRef<"Supplier", 'String'>
    readonly service_types: FieldRef<"Supplier", 'String[]'>
    readonly created_at: FieldRef<"Supplier", 'DateTime'>
    readonly updated_at: FieldRef<"Supplier", 'DateTime'>
    readonly is_Active: FieldRef<"Supplier", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Supplier findUnique
   */
  export type SupplierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findUniqueOrThrow
   */
  export type SupplierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier findFirst
   */
  export type SupplierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findFirstOrThrow
   */
  export type SupplierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Supplier to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Suppliers.
     */
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier findMany
   */
  export type SupplierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter, which Suppliers to fetch.
     */
    where?: SupplierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Suppliers to fetch.
     */
    orderBy?: SupplierOrderByWithRelationInput | SupplierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Suppliers.
     */
    cursor?: SupplierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Suppliers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Suppliers.
     */
    skip?: number
    distinct?: SupplierScalarFieldEnum | SupplierScalarFieldEnum[]
  }

  /**
   * Supplier create
   */
  export type SupplierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to create a Supplier.
     */
    data: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
  }

  /**
   * Supplier createMany
   */
  export type SupplierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier createManyAndReturn
   */
  export type SupplierCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to create many Suppliers.
     */
    data: SupplierCreateManyInput | SupplierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Supplier update
   */
  export type SupplierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The data needed to update a Supplier.
     */
    data: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
    /**
     * Choose, which Supplier to update.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier updateMany
   */
  export type SupplierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier updateManyAndReturn
   */
  export type SupplierUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * The data used to update Suppliers.
     */
    data: XOR<SupplierUpdateManyMutationInput, SupplierUncheckedUpdateManyInput>
    /**
     * Filter which Suppliers to update
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to update.
     */
    limit?: number
  }

  /**
   * Supplier upsert
   */
  export type SupplierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * The filter to search for the Supplier to update in case it exists.
     */
    where: SupplierWhereUniqueInput
    /**
     * In case the Supplier found by the `where` argument doesn't exist, create a new Supplier with this data.
     */
    create: XOR<SupplierCreateInput, SupplierUncheckedCreateInput>
    /**
     * In case the Supplier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SupplierUpdateInput, SupplierUncheckedUpdateInput>
  }

  /**
   * Supplier delete
   */
  export type SupplierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
    /**
     * Filter which Supplier to delete.
     */
    where: SupplierWhereUniqueInput
  }

  /**
   * Supplier deleteMany
   */
  export type SupplierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Suppliers to delete
     */
    where?: SupplierWhereInput
    /**
     * Limit how many Suppliers to delete.
     */
    limit?: number
  }

  /**
   * Supplier.Maintenance
   */
  export type Supplier$MaintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    where?: MaintenanceWhereInput
    orderBy?: MaintenanceOrderByWithRelationInput | MaintenanceOrderByWithRelationInput[]
    cursor?: MaintenanceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MaintenanceScalarFieldEnum | MaintenanceScalarFieldEnum[]
  }

  /**
   * Supplier without action
   */
  export type SupplierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Supplier
     */
    select?: SupplierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Supplier
     */
    omit?: SupplierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SupplierInclude<ExtArgs> | null
  }


  /**
   * Model Maintenance
   */

  export type AggregateMaintenance = {
    _count: MaintenanceCountAggregateOutputType | null
    _avg: MaintenanceAvgAggregateOutputType | null
    _sum: MaintenanceSumAggregateOutputType | null
    _min: MaintenanceMinAggregateOutputType | null
    _max: MaintenanceMaxAggregateOutputType | null
  }

  export type MaintenanceAvgAggregateOutputType = {
    estimated_cost: Decimal | null
    actual_cost: Decimal | null
  }

  export type MaintenanceSumAggregateOutputType = {
    estimated_cost: Decimal | null
    actual_cost: Decimal | null
  }

  export type MaintenanceMinAggregateOutputType = {
    id: string | null
    assetId: string | null
    supplierId: string | null
    type: $Enums.MaintenanceType | null
    description: string | null
    scheduled_date: Date | null
    started_date: Date | null
    completed_date: Date | null
    estimated_cost: Decimal | null
    actual_cost: Decimal | null
    status: $Enums.MaintenanceStatus | null
    notes: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type MaintenanceMaxAggregateOutputType = {
    id: string | null
    assetId: string | null
    supplierId: string | null
    type: $Enums.MaintenanceType | null
    description: string | null
    scheduled_date: Date | null
    started_date: Date | null
    completed_date: Date | null
    estimated_cost: Decimal | null
    actual_cost: Decimal | null
    status: $Enums.MaintenanceStatus | null
    notes: string | null
    created_at: Date | null
    updated_at: Date | null
    is_Active: boolean | null
  }

  export type MaintenanceCountAggregateOutputType = {
    id: number
    assetId: number
    supplierId: number
    type: number
    description: number
    scheduled_date: number
    started_date: number
    completed_date: number
    estimated_cost: number
    actual_cost: number
    status: number
    notes: number
    created_at: number
    updated_at: number
    is_Active: number
    _all: number
  }


  export type MaintenanceAvgAggregateInputType = {
    estimated_cost?: true
    actual_cost?: true
  }

  export type MaintenanceSumAggregateInputType = {
    estimated_cost?: true
    actual_cost?: true
  }

  export type MaintenanceMinAggregateInputType = {
    id?: true
    assetId?: true
    supplierId?: true
    type?: true
    description?: true
    scheduled_date?: true
    started_date?: true
    completed_date?: true
    estimated_cost?: true
    actual_cost?: true
    status?: true
    notes?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type MaintenanceMaxAggregateInputType = {
    id?: true
    assetId?: true
    supplierId?: true
    type?: true
    description?: true
    scheduled_date?: true
    started_date?: true
    completed_date?: true
    estimated_cost?: true
    actual_cost?: true
    status?: true
    notes?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
  }

  export type MaintenanceCountAggregateInputType = {
    id?: true
    assetId?: true
    supplierId?: true
    type?: true
    description?: true
    scheduled_date?: true
    started_date?: true
    completed_date?: true
    estimated_cost?: true
    actual_cost?: true
    status?: true
    notes?: true
    created_at?: true
    updated_at?: true
    is_Active?: true
    _all?: true
  }

  export type MaintenanceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Maintenance to aggregate.
     */
    where?: MaintenanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maintenances to fetch.
     */
    orderBy?: MaintenanceOrderByWithRelationInput | MaintenanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maintenances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maintenances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Maintenances
    **/
    _count?: true | MaintenanceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceMaxAggregateInputType
  }

  export type GetMaintenanceAggregateType<T extends MaintenanceAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenance]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenance[P]>
      : GetScalarType<T[P], AggregateMaintenance[P]>
  }




  export type MaintenanceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceWhereInput
    orderBy?: MaintenanceOrderByWithAggregationInput | MaintenanceOrderByWithAggregationInput[]
    by: MaintenanceScalarFieldEnum[] | MaintenanceScalarFieldEnum
    having?: MaintenanceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceCountAggregateInputType | true
    _avg?: MaintenanceAvgAggregateInputType
    _sum?: MaintenanceSumAggregateInputType
    _min?: MaintenanceMinAggregateInputType
    _max?: MaintenanceMaxAggregateInputType
  }

  export type MaintenanceGroupByOutputType = {
    id: string
    assetId: string
    supplierId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date
    started_date: Date | null
    completed_date: Date | null
    estimated_cost: Decimal | null
    actual_cost: Decimal | null
    status: $Enums.MaintenanceStatus
    notes: string | null
    created_at: Date
    updated_at: Date
    is_Active: boolean
    _count: MaintenanceCountAggregateOutputType | null
    _avg: MaintenanceAvgAggregateOutputType | null
    _sum: MaintenanceSumAggregateOutputType | null
    _min: MaintenanceMinAggregateOutputType | null
    _max: MaintenanceMaxAggregateOutputType | null
  }

  type GetMaintenanceGroupByPayload<T extends MaintenanceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    supplierId?: boolean
    type?: boolean
    description?: boolean
    scheduled_date?: boolean
    started_date?: boolean
    completed_date?: boolean
    estimated_cost?: boolean
    actual_cost?: boolean
    status?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    documents?: boolean | Maintenance$documentsArgs<ExtArgs>
    _count?: boolean | MaintenanceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenance"]>

  export type MaintenanceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    supplierId?: boolean
    type?: boolean
    description?: boolean
    scheduled_date?: boolean
    started_date?: boolean
    completed_date?: boolean
    estimated_cost?: boolean
    actual_cost?: boolean
    status?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenance"]>

  export type MaintenanceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    assetId?: boolean
    supplierId?: boolean
    type?: boolean
    description?: boolean
    scheduled_date?: boolean
    started_date?: boolean
    completed_date?: boolean
    estimated_cost?: boolean
    actual_cost?: boolean
    status?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["maintenance"]>

  export type MaintenanceSelectScalar = {
    id?: boolean
    assetId?: boolean
    supplierId?: boolean
    type?: boolean
    description?: boolean
    scheduled_date?: boolean
    started_date?: boolean
    completed_date?: boolean
    estimated_cost?: boolean
    actual_cost?: boolean
    status?: boolean
    notes?: boolean
    created_at?: boolean
    updated_at?: boolean
    is_Active?: boolean
  }

  export type MaintenanceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "assetId" | "supplierId" | "type" | "description" | "scheduled_date" | "started_date" | "completed_date" | "estimated_cost" | "actual_cost" | "status" | "notes" | "created_at" | "updated_at" | "is_Active", ExtArgs["result"]["maintenance"]>
  export type MaintenanceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
    documents?: boolean | Maintenance$documentsArgs<ExtArgs>
    _count?: boolean | MaintenanceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MaintenanceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }
  export type MaintenanceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    asset?: boolean | AssetDefaultArgs<ExtArgs>
    supplier?: boolean | SupplierDefaultArgs<ExtArgs>
  }

  export type $MaintenancePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Maintenance"
    objects: {
      asset: Prisma.$AssetPayload<ExtArgs>
      supplier: Prisma.$SupplierPayload<ExtArgs>
      documents: Prisma.$MaintenanceDocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      assetId: string
      supplierId: string
      type: $Enums.MaintenanceType
      description: string
      scheduled_date: Date
      started_date: Date | null
      completed_date: Date | null
      estimated_cost: Prisma.Decimal | null
      actual_cost: Prisma.Decimal | null
      status: $Enums.MaintenanceStatus
      notes: string | null
      created_at: Date
      updated_at: Date
      is_Active: boolean
    }, ExtArgs["result"]["maintenance"]>
    composites: {}
  }

  type MaintenanceGetPayload<S extends boolean | null | undefined | MaintenanceDefaultArgs> = $Result.GetResult<Prisma.$MaintenancePayload, S>

  type MaintenanceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceCountAggregateInputType | true
    }

  export interface MaintenanceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Maintenance'], meta: { name: 'Maintenance' } }
    /**
     * Find zero or one Maintenance that matches the filter.
     * @param {MaintenanceFindUniqueArgs} args - Arguments to find a Maintenance
     * @example
     * // Get one Maintenance
     * const maintenance = await prisma.maintenance.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceFindUniqueArgs>(args: SelectSubset<T, MaintenanceFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Maintenance that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceFindUniqueOrThrowArgs} args - Arguments to find a Maintenance
     * @example
     * // Get one Maintenance
     * const maintenance = await prisma.maintenance.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Maintenance that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceFindFirstArgs} args - Arguments to find a Maintenance
     * @example
     * // Get one Maintenance
     * const maintenance = await prisma.maintenance.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceFindFirstArgs>(args?: SelectSubset<T, MaintenanceFindFirstArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Maintenance that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceFindFirstOrThrowArgs} args - Arguments to find a Maintenance
     * @example
     * // Get one Maintenance
     * const maintenance = await prisma.maintenance.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Maintenances that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Maintenances
     * const maintenances = await prisma.maintenance.findMany()
     * 
     * // Get first 10 Maintenances
     * const maintenances = await prisma.maintenance.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceWithIdOnly = await prisma.maintenance.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceFindManyArgs>(args?: SelectSubset<T, MaintenanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Maintenance.
     * @param {MaintenanceCreateArgs} args - Arguments to create a Maintenance.
     * @example
     * // Create one Maintenance
     * const Maintenance = await prisma.maintenance.create({
     *   data: {
     *     // ... data to create a Maintenance
     *   }
     * })
     * 
     */
    create<T extends MaintenanceCreateArgs>(args: SelectSubset<T, MaintenanceCreateArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Maintenances.
     * @param {MaintenanceCreateManyArgs} args - Arguments to create many Maintenances.
     * @example
     * // Create many Maintenances
     * const maintenance = await prisma.maintenance.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceCreateManyArgs>(args?: SelectSubset<T, MaintenanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Maintenances and returns the data saved in the database.
     * @param {MaintenanceCreateManyAndReturnArgs} args - Arguments to create many Maintenances.
     * @example
     * // Create many Maintenances
     * const maintenance = await prisma.maintenance.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Maintenances and only return the `id`
     * const maintenanceWithIdOnly = await prisma.maintenance.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Maintenance.
     * @param {MaintenanceDeleteArgs} args - Arguments to delete one Maintenance.
     * @example
     * // Delete one Maintenance
     * const Maintenance = await prisma.maintenance.delete({
     *   where: {
     *     // ... filter to delete one Maintenance
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceDeleteArgs>(args: SelectSubset<T, MaintenanceDeleteArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Maintenance.
     * @param {MaintenanceUpdateArgs} args - Arguments to update one Maintenance.
     * @example
     * // Update one Maintenance
     * const maintenance = await prisma.maintenance.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceUpdateArgs>(args: SelectSubset<T, MaintenanceUpdateArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Maintenances.
     * @param {MaintenanceDeleteManyArgs} args - Arguments to filter Maintenances to delete.
     * @example
     * // Delete a few Maintenances
     * const { count } = await prisma.maintenance.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceDeleteManyArgs>(args?: SelectSubset<T, MaintenanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Maintenances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Maintenances
     * const maintenance = await prisma.maintenance.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceUpdateManyArgs>(args: SelectSubset<T, MaintenanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Maintenances and returns the data updated in the database.
     * @param {MaintenanceUpdateManyAndReturnArgs} args - Arguments to update many Maintenances.
     * @example
     * // Update many Maintenances
     * const maintenance = await prisma.maintenance.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Maintenances and only return the `id`
     * const maintenanceWithIdOnly = await prisma.maintenance.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaintenanceUpdateManyAndReturnArgs>(args: SelectSubset<T, MaintenanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Maintenance.
     * @param {MaintenanceUpsertArgs} args - Arguments to update or create a Maintenance.
     * @example
     * // Update or create a Maintenance
     * const maintenance = await prisma.maintenance.upsert({
     *   create: {
     *     // ... data to create a Maintenance
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Maintenance we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceUpsertArgs>(args: SelectSubset<T, MaintenanceUpsertArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Maintenances.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceCountArgs} args - Arguments to filter Maintenances to count.
     * @example
     * // Count the number of Maintenances
     * const count = await prisma.maintenance.count({
     *   where: {
     *     // ... the filter for the Maintenances we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceCountArgs>(
      args?: Subset<T, MaintenanceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Maintenance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaintenanceAggregateArgs>(args: Subset<T, MaintenanceAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceAggregateType<T>>

    /**
     * Group by Maintenance.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaintenanceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaintenanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Maintenance model
   */
  readonly fields: MaintenanceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Maintenance.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    asset<T extends AssetDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AssetDefaultArgs<ExtArgs>>): Prisma__AssetClient<$Result.GetResult<Prisma.$AssetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    supplier<T extends SupplierDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SupplierDefaultArgs<ExtArgs>>): Prisma__SupplierClient<$Result.GetResult<Prisma.$SupplierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    documents<T extends Maintenance$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Maintenance$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Maintenance model
   */
  interface MaintenanceFieldRefs {
    readonly id: FieldRef<"Maintenance", 'String'>
    readonly assetId: FieldRef<"Maintenance", 'String'>
    readonly supplierId: FieldRef<"Maintenance", 'String'>
    readonly type: FieldRef<"Maintenance", 'MaintenanceType'>
    readonly description: FieldRef<"Maintenance", 'String'>
    readonly scheduled_date: FieldRef<"Maintenance", 'DateTime'>
    readonly started_date: FieldRef<"Maintenance", 'DateTime'>
    readonly completed_date: FieldRef<"Maintenance", 'DateTime'>
    readonly estimated_cost: FieldRef<"Maintenance", 'Decimal'>
    readonly actual_cost: FieldRef<"Maintenance", 'Decimal'>
    readonly status: FieldRef<"Maintenance", 'MaintenanceStatus'>
    readonly notes: FieldRef<"Maintenance", 'String'>
    readonly created_at: FieldRef<"Maintenance", 'DateTime'>
    readonly updated_at: FieldRef<"Maintenance", 'DateTime'>
    readonly is_Active: FieldRef<"Maintenance", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Maintenance findUnique
   */
  export type MaintenanceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * Filter, which Maintenance to fetch.
     */
    where: MaintenanceWhereUniqueInput
  }

  /**
   * Maintenance findUniqueOrThrow
   */
  export type MaintenanceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * Filter, which Maintenance to fetch.
     */
    where: MaintenanceWhereUniqueInput
  }

  /**
   * Maintenance findFirst
   */
  export type MaintenanceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * Filter, which Maintenance to fetch.
     */
    where?: MaintenanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maintenances to fetch.
     */
    orderBy?: MaintenanceOrderByWithRelationInput | MaintenanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Maintenances.
     */
    cursor?: MaintenanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maintenances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maintenances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Maintenances.
     */
    distinct?: MaintenanceScalarFieldEnum | MaintenanceScalarFieldEnum[]
  }

  /**
   * Maintenance findFirstOrThrow
   */
  export type MaintenanceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * Filter, which Maintenance to fetch.
     */
    where?: MaintenanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maintenances to fetch.
     */
    orderBy?: MaintenanceOrderByWithRelationInput | MaintenanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Maintenances.
     */
    cursor?: MaintenanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maintenances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maintenances.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Maintenances.
     */
    distinct?: MaintenanceScalarFieldEnum | MaintenanceScalarFieldEnum[]
  }

  /**
   * Maintenance findMany
   */
  export type MaintenanceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * Filter, which Maintenances to fetch.
     */
    where?: MaintenanceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Maintenances to fetch.
     */
    orderBy?: MaintenanceOrderByWithRelationInput | MaintenanceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Maintenances.
     */
    cursor?: MaintenanceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Maintenances from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Maintenances.
     */
    skip?: number
    distinct?: MaintenanceScalarFieldEnum | MaintenanceScalarFieldEnum[]
  }

  /**
   * Maintenance create
   */
  export type MaintenanceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * The data needed to create a Maintenance.
     */
    data: XOR<MaintenanceCreateInput, MaintenanceUncheckedCreateInput>
  }

  /**
   * Maintenance createMany
   */
  export type MaintenanceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Maintenances.
     */
    data: MaintenanceCreateManyInput | MaintenanceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Maintenance createManyAndReturn
   */
  export type MaintenanceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * The data used to create many Maintenances.
     */
    data: MaintenanceCreateManyInput | MaintenanceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Maintenance update
   */
  export type MaintenanceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * The data needed to update a Maintenance.
     */
    data: XOR<MaintenanceUpdateInput, MaintenanceUncheckedUpdateInput>
    /**
     * Choose, which Maintenance to update.
     */
    where: MaintenanceWhereUniqueInput
  }

  /**
   * Maintenance updateMany
   */
  export type MaintenanceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Maintenances.
     */
    data: XOR<MaintenanceUpdateManyMutationInput, MaintenanceUncheckedUpdateManyInput>
    /**
     * Filter which Maintenances to update
     */
    where?: MaintenanceWhereInput
    /**
     * Limit how many Maintenances to update.
     */
    limit?: number
  }

  /**
   * Maintenance updateManyAndReturn
   */
  export type MaintenanceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * The data used to update Maintenances.
     */
    data: XOR<MaintenanceUpdateManyMutationInput, MaintenanceUncheckedUpdateManyInput>
    /**
     * Filter which Maintenances to update
     */
    where?: MaintenanceWhereInput
    /**
     * Limit how many Maintenances to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Maintenance upsert
   */
  export type MaintenanceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * The filter to search for the Maintenance to update in case it exists.
     */
    where: MaintenanceWhereUniqueInput
    /**
     * In case the Maintenance found by the `where` argument doesn't exist, create a new Maintenance with this data.
     */
    create: XOR<MaintenanceCreateInput, MaintenanceUncheckedCreateInput>
    /**
     * In case the Maintenance was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceUpdateInput, MaintenanceUncheckedUpdateInput>
  }

  /**
   * Maintenance delete
   */
  export type MaintenanceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    /**
     * Filter which Maintenance to delete.
     */
    where: MaintenanceWhereUniqueInput
  }

  /**
   * Maintenance deleteMany
   */
  export type MaintenanceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Maintenances to delete
     */
    where?: MaintenanceWhereInput
    /**
     * Limit how many Maintenances to delete.
     */
    limit?: number
  }

  /**
   * Maintenance.documents
   */
  export type Maintenance$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    where?: MaintenanceDocumentWhereInput
    orderBy?: MaintenanceDocumentOrderByWithRelationInput | MaintenanceDocumentOrderByWithRelationInput[]
    cursor?: MaintenanceDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MaintenanceDocumentScalarFieldEnum | MaintenanceDocumentScalarFieldEnum[]
  }

  /**
   * Maintenance without action
   */
  export type MaintenanceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
  }


  /**
   * Model MaintenanceDocument
   */

  export type AggregateMaintenanceDocument = {
    _count: MaintenanceDocumentCountAggregateOutputType | null
    _avg: MaintenanceDocumentAvgAggregateOutputType | null
    _sum: MaintenanceDocumentSumAggregateOutputType | null
    _min: MaintenanceDocumentMinAggregateOutputType | null
    _max: MaintenanceDocumentMaxAggregateOutputType | null
  }

  export type MaintenanceDocumentAvgAggregateOutputType = {
    file_size: number | null
  }

  export type MaintenanceDocumentSumAggregateOutputType = {
    file_size: number | null
  }

  export type MaintenanceDocumentMinAggregateOutputType = {
    id: string | null
    filename: string | null
    original_name: string | null
    file_path: string | null
    file_size: number | null
    mime_type: string | null
    description: string | null
    created_at: Date | null
    maintenanceId: string | null
  }

  export type MaintenanceDocumentMaxAggregateOutputType = {
    id: string | null
    filename: string | null
    original_name: string | null
    file_path: string | null
    file_size: number | null
    mime_type: string | null
    description: string | null
    created_at: Date | null
    maintenanceId: string | null
  }

  export type MaintenanceDocumentCountAggregateOutputType = {
    id: number
    filename: number
    original_name: number
    file_path: number
    file_size: number
    mime_type: number
    description: number
    created_at: number
    maintenanceId: number
    _all: number
  }


  export type MaintenanceDocumentAvgAggregateInputType = {
    file_size?: true
  }

  export type MaintenanceDocumentSumAggregateInputType = {
    file_size?: true
  }

  export type MaintenanceDocumentMinAggregateInputType = {
    id?: true
    filename?: true
    original_name?: true
    file_path?: true
    file_size?: true
    mime_type?: true
    description?: true
    created_at?: true
    maintenanceId?: true
  }

  export type MaintenanceDocumentMaxAggregateInputType = {
    id?: true
    filename?: true
    original_name?: true
    file_path?: true
    file_size?: true
    mime_type?: true
    description?: true
    created_at?: true
    maintenanceId?: true
  }

  export type MaintenanceDocumentCountAggregateInputType = {
    id?: true
    filename?: true
    original_name?: true
    file_path?: true
    file_size?: true
    mime_type?: true
    description?: true
    created_at?: true
    maintenanceId?: true
    _all?: true
  }

  export type MaintenanceDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceDocument to aggregate.
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceDocuments to fetch.
     */
    orderBy?: MaintenanceDocumentOrderByWithRelationInput | MaintenanceDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MaintenanceDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MaintenanceDocuments
    **/
    _count?: true | MaintenanceDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MaintenanceDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MaintenanceDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MaintenanceDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MaintenanceDocumentMaxAggregateInputType
  }

  export type GetMaintenanceDocumentAggregateType<T extends MaintenanceDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateMaintenanceDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMaintenanceDocument[P]>
      : GetScalarType<T[P], AggregateMaintenanceDocument[P]>
  }




  export type MaintenanceDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MaintenanceDocumentWhereInput
    orderBy?: MaintenanceDocumentOrderByWithAggregationInput | MaintenanceDocumentOrderByWithAggregationInput[]
    by: MaintenanceDocumentScalarFieldEnum[] | MaintenanceDocumentScalarFieldEnum
    having?: MaintenanceDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MaintenanceDocumentCountAggregateInputType | true
    _avg?: MaintenanceDocumentAvgAggregateInputType
    _sum?: MaintenanceDocumentSumAggregateInputType
    _min?: MaintenanceDocumentMinAggregateInputType
    _max?: MaintenanceDocumentMaxAggregateInputType
  }

  export type MaintenanceDocumentGroupByOutputType = {
    id: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description: string | null
    created_at: Date
    maintenanceId: string | null
    _count: MaintenanceDocumentCountAggregateOutputType | null
    _avg: MaintenanceDocumentAvgAggregateOutputType | null
    _sum: MaintenanceDocumentSumAggregateOutputType | null
    _min: MaintenanceDocumentMinAggregateOutputType | null
    _max: MaintenanceDocumentMaxAggregateOutputType | null
  }

  type GetMaintenanceDocumentGroupByPayload<T extends MaintenanceDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MaintenanceDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MaintenanceDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MaintenanceDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], MaintenanceDocumentGroupByOutputType[P]>
        }
      >
    >


  export type MaintenanceDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    original_name?: boolean
    file_path?: boolean
    file_size?: boolean
    mime_type?: boolean
    description?: boolean
    created_at?: boolean
    maintenanceId?: boolean
    Maintenance?: boolean | MaintenanceDocument$MaintenanceArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceDocument"]>

  export type MaintenanceDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    original_name?: boolean
    file_path?: boolean
    file_size?: boolean
    mime_type?: boolean
    description?: boolean
    created_at?: boolean
    maintenanceId?: boolean
    Maintenance?: boolean | MaintenanceDocument$MaintenanceArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceDocument"]>

  export type MaintenanceDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    filename?: boolean
    original_name?: boolean
    file_path?: boolean
    file_size?: boolean
    mime_type?: boolean
    description?: boolean
    created_at?: boolean
    maintenanceId?: boolean
    Maintenance?: boolean | MaintenanceDocument$MaintenanceArgs<ExtArgs>
  }, ExtArgs["result"]["maintenanceDocument"]>

  export type MaintenanceDocumentSelectScalar = {
    id?: boolean
    filename?: boolean
    original_name?: boolean
    file_path?: boolean
    file_size?: boolean
    mime_type?: boolean
    description?: boolean
    created_at?: boolean
    maintenanceId?: boolean
  }

  export type MaintenanceDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "filename" | "original_name" | "file_path" | "file_size" | "mime_type" | "description" | "created_at" | "maintenanceId", ExtArgs["result"]["maintenanceDocument"]>
  export type MaintenanceDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Maintenance?: boolean | MaintenanceDocument$MaintenanceArgs<ExtArgs>
  }
  export type MaintenanceDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Maintenance?: boolean | MaintenanceDocument$MaintenanceArgs<ExtArgs>
  }
  export type MaintenanceDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    Maintenance?: boolean | MaintenanceDocument$MaintenanceArgs<ExtArgs>
  }

  export type $MaintenanceDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MaintenanceDocument"
    objects: {
      Maintenance: Prisma.$MaintenancePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      filename: string
      original_name: string
      file_path: string
      file_size: number
      mime_type: string
      description: string | null
      created_at: Date
      maintenanceId: string | null
    }, ExtArgs["result"]["maintenanceDocument"]>
    composites: {}
  }

  type MaintenanceDocumentGetPayload<S extends boolean | null | undefined | MaintenanceDocumentDefaultArgs> = $Result.GetResult<Prisma.$MaintenanceDocumentPayload, S>

  type MaintenanceDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MaintenanceDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MaintenanceDocumentCountAggregateInputType | true
    }

  export interface MaintenanceDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MaintenanceDocument'], meta: { name: 'MaintenanceDocument' } }
    /**
     * Find zero or one MaintenanceDocument that matches the filter.
     * @param {MaintenanceDocumentFindUniqueArgs} args - Arguments to find a MaintenanceDocument
     * @example
     * // Get one MaintenanceDocument
     * const maintenanceDocument = await prisma.maintenanceDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MaintenanceDocumentFindUniqueArgs>(args: SelectSubset<T, MaintenanceDocumentFindUniqueArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MaintenanceDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MaintenanceDocumentFindUniqueOrThrowArgs} args - Arguments to find a MaintenanceDocument
     * @example
     * // Get one MaintenanceDocument
     * const maintenanceDocument = await prisma.maintenanceDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MaintenanceDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, MaintenanceDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentFindFirstArgs} args - Arguments to find a MaintenanceDocument
     * @example
     * // Get one MaintenanceDocument
     * const maintenanceDocument = await prisma.maintenanceDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MaintenanceDocumentFindFirstArgs>(args?: SelectSubset<T, MaintenanceDocumentFindFirstArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MaintenanceDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentFindFirstOrThrowArgs} args - Arguments to find a MaintenanceDocument
     * @example
     * // Get one MaintenanceDocument
     * const maintenanceDocument = await prisma.maintenanceDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MaintenanceDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, MaintenanceDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MaintenanceDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MaintenanceDocuments
     * const maintenanceDocuments = await prisma.maintenanceDocument.findMany()
     * 
     * // Get first 10 MaintenanceDocuments
     * const maintenanceDocuments = await prisma.maintenanceDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const maintenanceDocumentWithIdOnly = await prisma.maintenanceDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MaintenanceDocumentFindManyArgs>(args?: SelectSubset<T, MaintenanceDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MaintenanceDocument.
     * @param {MaintenanceDocumentCreateArgs} args - Arguments to create a MaintenanceDocument.
     * @example
     * // Create one MaintenanceDocument
     * const MaintenanceDocument = await prisma.maintenanceDocument.create({
     *   data: {
     *     // ... data to create a MaintenanceDocument
     *   }
     * })
     * 
     */
    create<T extends MaintenanceDocumentCreateArgs>(args: SelectSubset<T, MaintenanceDocumentCreateArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MaintenanceDocuments.
     * @param {MaintenanceDocumentCreateManyArgs} args - Arguments to create many MaintenanceDocuments.
     * @example
     * // Create many MaintenanceDocuments
     * const maintenanceDocument = await prisma.maintenanceDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MaintenanceDocumentCreateManyArgs>(args?: SelectSubset<T, MaintenanceDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MaintenanceDocuments and returns the data saved in the database.
     * @param {MaintenanceDocumentCreateManyAndReturnArgs} args - Arguments to create many MaintenanceDocuments.
     * @example
     * // Create many MaintenanceDocuments
     * const maintenanceDocument = await prisma.maintenanceDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MaintenanceDocuments and only return the `id`
     * const maintenanceDocumentWithIdOnly = await prisma.maintenanceDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MaintenanceDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, MaintenanceDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MaintenanceDocument.
     * @param {MaintenanceDocumentDeleteArgs} args - Arguments to delete one MaintenanceDocument.
     * @example
     * // Delete one MaintenanceDocument
     * const MaintenanceDocument = await prisma.maintenanceDocument.delete({
     *   where: {
     *     // ... filter to delete one MaintenanceDocument
     *   }
     * })
     * 
     */
    delete<T extends MaintenanceDocumentDeleteArgs>(args: SelectSubset<T, MaintenanceDocumentDeleteArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MaintenanceDocument.
     * @param {MaintenanceDocumentUpdateArgs} args - Arguments to update one MaintenanceDocument.
     * @example
     * // Update one MaintenanceDocument
     * const maintenanceDocument = await prisma.maintenanceDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MaintenanceDocumentUpdateArgs>(args: SelectSubset<T, MaintenanceDocumentUpdateArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MaintenanceDocuments.
     * @param {MaintenanceDocumentDeleteManyArgs} args - Arguments to filter MaintenanceDocuments to delete.
     * @example
     * // Delete a few MaintenanceDocuments
     * const { count } = await prisma.maintenanceDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MaintenanceDocumentDeleteManyArgs>(args?: SelectSubset<T, MaintenanceDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MaintenanceDocuments
     * const maintenanceDocument = await prisma.maintenanceDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MaintenanceDocumentUpdateManyArgs>(args: SelectSubset<T, MaintenanceDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MaintenanceDocuments and returns the data updated in the database.
     * @param {MaintenanceDocumentUpdateManyAndReturnArgs} args - Arguments to update many MaintenanceDocuments.
     * @example
     * // Update many MaintenanceDocuments
     * const maintenanceDocument = await prisma.maintenanceDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MaintenanceDocuments and only return the `id`
     * const maintenanceDocumentWithIdOnly = await prisma.maintenanceDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MaintenanceDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, MaintenanceDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MaintenanceDocument.
     * @param {MaintenanceDocumentUpsertArgs} args - Arguments to update or create a MaintenanceDocument.
     * @example
     * // Update or create a MaintenanceDocument
     * const maintenanceDocument = await prisma.maintenanceDocument.upsert({
     *   create: {
     *     // ... data to create a MaintenanceDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MaintenanceDocument we want to update
     *   }
     * })
     */
    upsert<T extends MaintenanceDocumentUpsertArgs>(args: SelectSubset<T, MaintenanceDocumentUpsertArgs<ExtArgs>>): Prisma__MaintenanceDocumentClient<$Result.GetResult<Prisma.$MaintenanceDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MaintenanceDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentCountArgs} args - Arguments to filter MaintenanceDocuments to count.
     * @example
     * // Count the number of MaintenanceDocuments
     * const count = await prisma.maintenanceDocument.count({
     *   where: {
     *     // ... the filter for the MaintenanceDocuments we want to count
     *   }
     * })
    **/
    count<T extends MaintenanceDocumentCountArgs>(
      args?: Subset<T, MaintenanceDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MaintenanceDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MaintenanceDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MaintenanceDocumentAggregateArgs>(args: Subset<T, MaintenanceDocumentAggregateArgs>): Prisma.PrismaPromise<GetMaintenanceDocumentAggregateType<T>>

    /**
     * Group by MaintenanceDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MaintenanceDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MaintenanceDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MaintenanceDocumentGroupByArgs['orderBy'] }
        : { orderBy?: MaintenanceDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MaintenanceDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMaintenanceDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MaintenanceDocument model
   */
  readonly fields: MaintenanceDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MaintenanceDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MaintenanceDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    Maintenance<T extends MaintenanceDocument$MaintenanceArgs<ExtArgs> = {}>(args?: Subset<T, MaintenanceDocument$MaintenanceArgs<ExtArgs>>): Prisma__MaintenanceClient<$Result.GetResult<Prisma.$MaintenancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MaintenanceDocument model
   */
  interface MaintenanceDocumentFieldRefs {
    readonly id: FieldRef<"MaintenanceDocument", 'String'>
    readonly filename: FieldRef<"MaintenanceDocument", 'String'>
    readonly original_name: FieldRef<"MaintenanceDocument", 'String'>
    readonly file_path: FieldRef<"MaintenanceDocument", 'String'>
    readonly file_size: FieldRef<"MaintenanceDocument", 'Int'>
    readonly mime_type: FieldRef<"MaintenanceDocument", 'String'>
    readonly description: FieldRef<"MaintenanceDocument", 'String'>
    readonly created_at: FieldRef<"MaintenanceDocument", 'DateTime'>
    readonly maintenanceId: FieldRef<"MaintenanceDocument", 'String'>
  }
    

  // Custom InputTypes
  /**
   * MaintenanceDocument findUnique
   */
  export type MaintenanceDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceDocument to fetch.
     */
    where: MaintenanceDocumentWhereUniqueInput
  }

  /**
   * MaintenanceDocument findUniqueOrThrow
   */
  export type MaintenanceDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceDocument to fetch.
     */
    where: MaintenanceDocumentWhereUniqueInput
  }

  /**
   * MaintenanceDocument findFirst
   */
  export type MaintenanceDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceDocument to fetch.
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceDocuments to fetch.
     */
    orderBy?: MaintenanceDocumentOrderByWithRelationInput | MaintenanceDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceDocuments.
     */
    cursor?: MaintenanceDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceDocuments.
     */
    distinct?: MaintenanceDocumentScalarFieldEnum | MaintenanceDocumentScalarFieldEnum[]
  }

  /**
   * MaintenanceDocument findFirstOrThrow
   */
  export type MaintenanceDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceDocument to fetch.
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceDocuments to fetch.
     */
    orderBy?: MaintenanceDocumentOrderByWithRelationInput | MaintenanceDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MaintenanceDocuments.
     */
    cursor?: MaintenanceDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MaintenanceDocuments.
     */
    distinct?: MaintenanceDocumentScalarFieldEnum | MaintenanceDocumentScalarFieldEnum[]
  }

  /**
   * MaintenanceDocument findMany
   */
  export type MaintenanceDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * Filter, which MaintenanceDocuments to fetch.
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MaintenanceDocuments to fetch.
     */
    orderBy?: MaintenanceDocumentOrderByWithRelationInput | MaintenanceDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MaintenanceDocuments.
     */
    cursor?: MaintenanceDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MaintenanceDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MaintenanceDocuments.
     */
    skip?: number
    distinct?: MaintenanceDocumentScalarFieldEnum | MaintenanceDocumentScalarFieldEnum[]
  }

  /**
   * MaintenanceDocument create
   */
  export type MaintenanceDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a MaintenanceDocument.
     */
    data: XOR<MaintenanceDocumentCreateInput, MaintenanceDocumentUncheckedCreateInput>
  }

  /**
   * MaintenanceDocument createMany
   */
  export type MaintenanceDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MaintenanceDocuments.
     */
    data: MaintenanceDocumentCreateManyInput | MaintenanceDocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MaintenanceDocument createManyAndReturn
   */
  export type MaintenanceDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many MaintenanceDocuments.
     */
    data: MaintenanceDocumentCreateManyInput | MaintenanceDocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MaintenanceDocument update
   */
  export type MaintenanceDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a MaintenanceDocument.
     */
    data: XOR<MaintenanceDocumentUpdateInput, MaintenanceDocumentUncheckedUpdateInput>
    /**
     * Choose, which MaintenanceDocument to update.
     */
    where: MaintenanceDocumentWhereUniqueInput
  }

  /**
   * MaintenanceDocument updateMany
   */
  export type MaintenanceDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MaintenanceDocuments.
     */
    data: XOR<MaintenanceDocumentUpdateManyMutationInput, MaintenanceDocumentUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceDocuments to update
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * Limit how many MaintenanceDocuments to update.
     */
    limit?: number
  }

  /**
   * MaintenanceDocument updateManyAndReturn
   */
  export type MaintenanceDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * The data used to update MaintenanceDocuments.
     */
    data: XOR<MaintenanceDocumentUpdateManyMutationInput, MaintenanceDocumentUncheckedUpdateManyInput>
    /**
     * Filter which MaintenanceDocuments to update
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * Limit how many MaintenanceDocuments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MaintenanceDocument upsert
   */
  export type MaintenanceDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the MaintenanceDocument to update in case it exists.
     */
    where: MaintenanceDocumentWhereUniqueInput
    /**
     * In case the MaintenanceDocument found by the `where` argument doesn't exist, create a new MaintenanceDocument with this data.
     */
    create: XOR<MaintenanceDocumentCreateInput, MaintenanceDocumentUncheckedCreateInput>
    /**
     * In case the MaintenanceDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MaintenanceDocumentUpdateInput, MaintenanceDocumentUncheckedUpdateInput>
  }

  /**
   * MaintenanceDocument delete
   */
  export type MaintenanceDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
    /**
     * Filter which MaintenanceDocument to delete.
     */
    where: MaintenanceDocumentWhereUniqueInput
  }

  /**
   * MaintenanceDocument deleteMany
   */
  export type MaintenanceDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MaintenanceDocuments to delete
     */
    where?: MaintenanceDocumentWhereInput
    /**
     * Limit how many MaintenanceDocuments to delete.
     */
    limit?: number
  }

  /**
   * MaintenanceDocument.Maintenance
   */
  export type MaintenanceDocument$MaintenanceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Maintenance
     */
    select?: MaintenanceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Maintenance
     */
    omit?: MaintenanceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceInclude<ExtArgs> | null
    where?: MaintenanceWhereInput
  }

  /**
   * MaintenanceDocument without action
   */
  export type MaintenanceDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MaintenanceDocument
     */
    select?: MaintenanceDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MaintenanceDocument
     */
    omit?: MaintenanceDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MaintenanceDocumentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    phone: 'phone',
    password_hash: 'password_hash',
    role: 'role',
    avatar: 'avatar',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_Active: 'is_Active'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AssetCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    type: 'type',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_Active: 'is_Active'
  };

  export type AssetCategoryScalarFieldEnum = (typeof AssetCategoryScalarFieldEnum)[keyof typeof AssetCategoryScalarFieldEnum]


  export const AssetScalarFieldEnum: {
    id: 'id',
    brand: 'brand',
    model: 'model',
    year: 'year',
    plate: 'plate',
    serial_number: 'serial_number',
    ownership: 'ownership',
    documentsUrl: 'documentsUrl',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_Active: 'is_Active',
    assetCategoryId: 'assetCategoryId'
  };

  export type AssetScalarFieldEnum = (typeof AssetScalarFieldEnum)[keyof typeof AssetScalarFieldEnum]


  export const SupplierScalarFieldEnum: {
    id: 'id',
    company_name: 'company_name',
    trading_name: 'trading_name',
    cnpj: 'cnpj',
    email: 'email',
    phone: 'phone',
    contact: 'contact',
    address: 'address',
    city: 'city',
    state: 'state',
    zip_code: 'zip_code',
    service_types: 'service_types',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_Active: 'is_Active'
  };

  export type SupplierScalarFieldEnum = (typeof SupplierScalarFieldEnum)[keyof typeof SupplierScalarFieldEnum]


  export const MaintenanceScalarFieldEnum: {
    id: 'id',
    assetId: 'assetId',
    supplierId: 'supplierId',
    type: 'type',
    description: 'description',
    scheduled_date: 'scheduled_date',
    started_date: 'started_date',
    completed_date: 'completed_date',
    estimated_cost: 'estimated_cost',
    actual_cost: 'actual_cost',
    status: 'status',
    notes: 'notes',
    created_at: 'created_at',
    updated_at: 'updated_at',
    is_Active: 'is_Active'
  };

  export type MaintenanceScalarFieldEnum = (typeof MaintenanceScalarFieldEnum)[keyof typeof MaintenanceScalarFieldEnum]


  export const MaintenanceDocumentScalarFieldEnum: {
    id: 'id',
    filename: 'filename',
    original_name: 'original_name',
    file_path: 'file_path',
    file_size: 'file_size',
    mime_type: 'mime_type',
    description: 'description',
    created_at: 'created_at',
    maintenanceId: 'maintenanceId'
  };

  export type MaintenanceDocumentScalarFieldEnum = (typeof MaintenanceDocumentScalarFieldEnum)[keyof typeof MaintenanceDocumentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'AssetType'
   */
  export type EnumAssetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetType'>
    


  /**
   * Reference to a field of type 'AssetType[]'
   */
  export type ListEnumAssetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetType[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'AssetOwnership'
   */
  export type EnumAssetOwnershipFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetOwnership'>
    


  /**
   * Reference to a field of type 'AssetOwnership[]'
   */
  export type ListEnumAssetOwnershipFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssetOwnership[]'>
    


  /**
   * Reference to a field of type 'MaintenanceType'
   */
  export type EnumMaintenanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceType'>
    


  /**
   * Reference to a field of type 'MaintenanceType[]'
   */
  export type ListEnumMaintenanceTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceType[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'MaintenanceStatus'
   */
  export type EnumMaintenanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceStatus'>
    


  /**
   * Reference to a field of type 'MaintenanceStatus[]'
   */
  export type ListEnumMaintenanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MaintenanceStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    password_hash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    avatar?: StringNullableFilter<"User"> | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    is_Active?: BoolFilter<"User"> | boolean
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    password_hash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    avatar?: StringNullableFilter<"User"> | string | null
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    is_Active?: BoolFilter<"User"> | boolean
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    avatar?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    password_hash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    is_Active?: BoolWithAggregatesFilter<"User"> | boolean
  }

  export type AssetCategoryWhereInput = {
    AND?: AssetCategoryWhereInput | AssetCategoryWhereInput[]
    OR?: AssetCategoryWhereInput[]
    NOT?: AssetCategoryWhereInput | AssetCategoryWhereInput[]
    id?: StringFilter<"AssetCategory"> | string
    name?: StringFilter<"AssetCategory"> | string
    description?: StringNullableFilter<"AssetCategory"> | string | null
    type?: EnumAssetTypeFilter<"AssetCategory"> | $Enums.AssetType
    created_at?: DateTimeFilter<"AssetCategory"> | Date | string
    updated_at?: DateTimeFilter<"AssetCategory"> | Date | string
    is_Active?: BoolFilter<"AssetCategory"> | boolean
    Asset?: AssetListRelationFilter
  }

  export type AssetCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    Asset?: AssetOrderByRelationAggregateInput
  }

  export type AssetCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: AssetCategoryWhereInput | AssetCategoryWhereInput[]
    OR?: AssetCategoryWhereInput[]
    NOT?: AssetCategoryWhereInput | AssetCategoryWhereInput[]
    description?: StringNullableFilter<"AssetCategory"> | string | null
    type?: EnumAssetTypeFilter<"AssetCategory"> | $Enums.AssetType
    created_at?: DateTimeFilter<"AssetCategory"> | Date | string
    updated_at?: DateTimeFilter<"AssetCategory"> | Date | string
    is_Active?: BoolFilter<"AssetCategory"> | boolean
    Asset?: AssetListRelationFilter
  }, "id" | "name">

  export type AssetCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    _count?: AssetCategoryCountOrderByAggregateInput
    _max?: AssetCategoryMaxOrderByAggregateInput
    _min?: AssetCategoryMinOrderByAggregateInput
  }

  export type AssetCategoryScalarWhereWithAggregatesInput = {
    AND?: AssetCategoryScalarWhereWithAggregatesInput | AssetCategoryScalarWhereWithAggregatesInput[]
    OR?: AssetCategoryScalarWhereWithAggregatesInput[]
    NOT?: AssetCategoryScalarWhereWithAggregatesInput | AssetCategoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AssetCategory"> | string
    name?: StringWithAggregatesFilter<"AssetCategory"> | string
    description?: StringNullableWithAggregatesFilter<"AssetCategory"> | string | null
    type?: EnumAssetTypeWithAggregatesFilter<"AssetCategory"> | $Enums.AssetType
    created_at?: DateTimeWithAggregatesFilter<"AssetCategory"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"AssetCategory"> | Date | string
    is_Active?: BoolWithAggregatesFilter<"AssetCategory"> | boolean
  }

  export type AssetWhereInput = {
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    id?: StringFilter<"Asset"> | string
    brand?: StringFilter<"Asset"> | string
    model?: StringFilter<"Asset"> | string
    year?: IntNullableFilter<"Asset"> | number | null
    plate?: StringNullableFilter<"Asset"> | string | null
    serial_number?: StringNullableFilter<"Asset"> | string | null
    ownership?: EnumAssetOwnershipFilter<"Asset"> | $Enums.AssetOwnership
    documentsUrl?: StringNullableFilter<"Asset"> | string | null
    created_at?: DateTimeFilter<"Asset"> | Date | string
    updated_at?: DateTimeFilter<"Asset"> | Date | string
    is_Active?: BoolFilter<"Asset"> | boolean
    assetCategoryId?: StringFilter<"Asset"> | string
    assetCategory?: XOR<AssetCategoryScalarRelationFilter, AssetCategoryWhereInput>
    Maintenance?: MaintenanceListRelationFilter
  }

  export type AssetOrderByWithRelationInput = {
    id?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    year?: SortOrderInput | SortOrder
    plate?: SortOrderInput | SortOrder
    serial_number?: SortOrderInput | SortOrder
    ownership?: SortOrder
    documentsUrl?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    assetCategoryId?: SortOrder
    assetCategory?: AssetCategoryOrderByWithRelationInput
    Maintenance?: MaintenanceOrderByRelationAggregateInput
  }

  export type AssetWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    plate?: string
    serial_number?: string
    AND?: AssetWhereInput | AssetWhereInput[]
    OR?: AssetWhereInput[]
    NOT?: AssetWhereInput | AssetWhereInput[]
    brand?: StringFilter<"Asset"> | string
    model?: StringFilter<"Asset"> | string
    year?: IntNullableFilter<"Asset"> | number | null
    ownership?: EnumAssetOwnershipFilter<"Asset"> | $Enums.AssetOwnership
    documentsUrl?: StringNullableFilter<"Asset"> | string | null
    created_at?: DateTimeFilter<"Asset"> | Date | string
    updated_at?: DateTimeFilter<"Asset"> | Date | string
    is_Active?: BoolFilter<"Asset"> | boolean
    assetCategoryId?: StringFilter<"Asset"> | string
    assetCategory?: XOR<AssetCategoryScalarRelationFilter, AssetCategoryWhereInput>
    Maintenance?: MaintenanceListRelationFilter
  }, "id" | "plate" | "serial_number">

  export type AssetOrderByWithAggregationInput = {
    id?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    year?: SortOrderInput | SortOrder
    plate?: SortOrderInput | SortOrder
    serial_number?: SortOrderInput | SortOrder
    ownership?: SortOrder
    documentsUrl?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    assetCategoryId?: SortOrder
    _count?: AssetCountOrderByAggregateInput
    _avg?: AssetAvgOrderByAggregateInput
    _max?: AssetMaxOrderByAggregateInput
    _min?: AssetMinOrderByAggregateInput
    _sum?: AssetSumOrderByAggregateInput
  }

  export type AssetScalarWhereWithAggregatesInput = {
    AND?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    OR?: AssetScalarWhereWithAggregatesInput[]
    NOT?: AssetScalarWhereWithAggregatesInput | AssetScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Asset"> | string
    brand?: StringWithAggregatesFilter<"Asset"> | string
    model?: StringWithAggregatesFilter<"Asset"> | string
    year?: IntNullableWithAggregatesFilter<"Asset"> | number | null
    plate?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    serial_number?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    ownership?: EnumAssetOwnershipWithAggregatesFilter<"Asset"> | $Enums.AssetOwnership
    documentsUrl?: StringNullableWithAggregatesFilter<"Asset"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Asset"> | Date | string
    is_Active?: BoolWithAggregatesFilter<"Asset"> | boolean
    assetCategoryId?: StringWithAggregatesFilter<"Asset"> | string
  }

  export type SupplierWhereInput = {
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    id?: StringFilter<"Supplier"> | string
    company_name?: StringFilter<"Supplier"> | string
    trading_name?: StringNullableFilter<"Supplier"> | string | null
    cnpj?: StringFilter<"Supplier"> | string
    email?: StringFilter<"Supplier"> | string
    phone?: StringFilter<"Supplier"> | string
    contact?: StringFilter<"Supplier"> | string
    address?: StringNullableFilter<"Supplier"> | string | null
    city?: StringNullableFilter<"Supplier"> | string | null
    state?: StringNullableFilter<"Supplier"> | string | null
    zip_code?: StringNullableFilter<"Supplier"> | string | null
    service_types?: StringNullableListFilter<"Supplier">
    created_at?: DateTimeFilter<"Supplier"> | Date | string
    updated_at?: DateTimeFilter<"Supplier"> | Date | string
    is_Active?: BoolFilter<"Supplier"> | boolean
    Maintenance?: MaintenanceListRelationFilter
  }

  export type SupplierOrderByWithRelationInput = {
    id?: SortOrder
    company_name?: SortOrder
    trading_name?: SortOrderInput | SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    contact?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zip_code?: SortOrderInput | SortOrder
    service_types?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    Maintenance?: MaintenanceOrderByRelationAggregateInput
  }

  export type SupplierWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    cnpj?: string
    AND?: SupplierWhereInput | SupplierWhereInput[]
    OR?: SupplierWhereInput[]
    NOT?: SupplierWhereInput | SupplierWhereInput[]
    company_name?: StringFilter<"Supplier"> | string
    trading_name?: StringNullableFilter<"Supplier"> | string | null
    email?: StringFilter<"Supplier"> | string
    phone?: StringFilter<"Supplier"> | string
    contact?: StringFilter<"Supplier"> | string
    address?: StringNullableFilter<"Supplier"> | string | null
    city?: StringNullableFilter<"Supplier"> | string | null
    state?: StringNullableFilter<"Supplier"> | string | null
    zip_code?: StringNullableFilter<"Supplier"> | string | null
    service_types?: StringNullableListFilter<"Supplier">
    created_at?: DateTimeFilter<"Supplier"> | Date | string
    updated_at?: DateTimeFilter<"Supplier"> | Date | string
    is_Active?: BoolFilter<"Supplier"> | boolean
    Maintenance?: MaintenanceListRelationFilter
  }, "id" | "cnpj">

  export type SupplierOrderByWithAggregationInput = {
    id?: SortOrder
    company_name?: SortOrder
    trading_name?: SortOrderInput | SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    contact?: SortOrder
    address?: SortOrderInput | SortOrder
    city?: SortOrderInput | SortOrder
    state?: SortOrderInput | SortOrder
    zip_code?: SortOrderInput | SortOrder
    service_types?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    _count?: SupplierCountOrderByAggregateInput
    _max?: SupplierMaxOrderByAggregateInput
    _min?: SupplierMinOrderByAggregateInput
  }

  export type SupplierScalarWhereWithAggregatesInput = {
    AND?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    OR?: SupplierScalarWhereWithAggregatesInput[]
    NOT?: SupplierScalarWhereWithAggregatesInput | SupplierScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Supplier"> | string
    company_name?: StringWithAggregatesFilter<"Supplier"> | string
    trading_name?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    cnpj?: StringWithAggregatesFilter<"Supplier"> | string
    email?: StringWithAggregatesFilter<"Supplier"> | string
    phone?: StringWithAggregatesFilter<"Supplier"> | string
    contact?: StringWithAggregatesFilter<"Supplier"> | string
    address?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    city?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    state?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    zip_code?: StringNullableWithAggregatesFilter<"Supplier"> | string | null
    service_types?: StringNullableListFilter<"Supplier">
    created_at?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Supplier"> | Date | string
    is_Active?: BoolWithAggregatesFilter<"Supplier"> | boolean
  }

  export type MaintenanceWhereInput = {
    AND?: MaintenanceWhereInput | MaintenanceWhereInput[]
    OR?: MaintenanceWhereInput[]
    NOT?: MaintenanceWhereInput | MaintenanceWhereInput[]
    id?: StringFilter<"Maintenance"> | string
    assetId?: StringFilter<"Maintenance"> | string
    supplierId?: StringFilter<"Maintenance"> | string
    type?: EnumMaintenanceTypeFilter<"Maintenance"> | $Enums.MaintenanceType
    description?: StringFilter<"Maintenance"> | string
    scheduled_date?: DateTimeFilter<"Maintenance"> | Date | string
    started_date?: DateTimeNullableFilter<"Maintenance"> | Date | string | null
    completed_date?: DateTimeNullableFilter<"Maintenance"> | Date | string | null
    estimated_cost?: DecimalNullableFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    actual_cost?: DecimalNullableFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFilter<"Maintenance"> | $Enums.MaintenanceStatus
    notes?: StringNullableFilter<"Maintenance"> | string | null
    created_at?: DateTimeFilter<"Maintenance"> | Date | string
    updated_at?: DateTimeFilter<"Maintenance"> | Date | string
    is_Active?: BoolFilter<"Maintenance"> | boolean
    asset?: XOR<AssetScalarRelationFilter, AssetWhereInput>
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
    documents?: MaintenanceDocumentListRelationFilter
  }

  export type MaintenanceOrderByWithRelationInput = {
    id?: SortOrder
    assetId?: SortOrder
    supplierId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    scheduled_date?: SortOrder
    started_date?: SortOrderInput | SortOrder
    completed_date?: SortOrderInput | SortOrder
    estimated_cost?: SortOrderInput | SortOrder
    actual_cost?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    asset?: AssetOrderByWithRelationInput
    supplier?: SupplierOrderByWithRelationInput
    documents?: MaintenanceDocumentOrderByRelationAggregateInput
  }

  export type MaintenanceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceWhereInput | MaintenanceWhereInput[]
    OR?: MaintenanceWhereInput[]
    NOT?: MaintenanceWhereInput | MaintenanceWhereInput[]
    assetId?: StringFilter<"Maintenance"> | string
    supplierId?: StringFilter<"Maintenance"> | string
    type?: EnumMaintenanceTypeFilter<"Maintenance"> | $Enums.MaintenanceType
    description?: StringFilter<"Maintenance"> | string
    scheduled_date?: DateTimeFilter<"Maintenance"> | Date | string
    started_date?: DateTimeNullableFilter<"Maintenance"> | Date | string | null
    completed_date?: DateTimeNullableFilter<"Maintenance"> | Date | string | null
    estimated_cost?: DecimalNullableFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    actual_cost?: DecimalNullableFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFilter<"Maintenance"> | $Enums.MaintenanceStatus
    notes?: StringNullableFilter<"Maintenance"> | string | null
    created_at?: DateTimeFilter<"Maintenance"> | Date | string
    updated_at?: DateTimeFilter<"Maintenance"> | Date | string
    is_Active?: BoolFilter<"Maintenance"> | boolean
    asset?: XOR<AssetScalarRelationFilter, AssetWhereInput>
    supplier?: XOR<SupplierScalarRelationFilter, SupplierWhereInput>
    documents?: MaintenanceDocumentListRelationFilter
  }, "id">

  export type MaintenanceOrderByWithAggregationInput = {
    id?: SortOrder
    assetId?: SortOrder
    supplierId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    scheduled_date?: SortOrder
    started_date?: SortOrderInput | SortOrder
    completed_date?: SortOrderInput | SortOrder
    estimated_cost?: SortOrderInput | SortOrder
    actual_cost?: SortOrderInput | SortOrder
    status?: SortOrder
    notes?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    _count?: MaintenanceCountOrderByAggregateInput
    _avg?: MaintenanceAvgOrderByAggregateInput
    _max?: MaintenanceMaxOrderByAggregateInput
    _min?: MaintenanceMinOrderByAggregateInput
    _sum?: MaintenanceSumOrderByAggregateInput
  }

  export type MaintenanceScalarWhereWithAggregatesInput = {
    AND?: MaintenanceScalarWhereWithAggregatesInput | MaintenanceScalarWhereWithAggregatesInput[]
    OR?: MaintenanceScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceScalarWhereWithAggregatesInput | MaintenanceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Maintenance"> | string
    assetId?: StringWithAggregatesFilter<"Maintenance"> | string
    supplierId?: StringWithAggregatesFilter<"Maintenance"> | string
    type?: EnumMaintenanceTypeWithAggregatesFilter<"Maintenance"> | $Enums.MaintenanceType
    description?: StringWithAggregatesFilter<"Maintenance"> | string
    scheduled_date?: DateTimeWithAggregatesFilter<"Maintenance"> | Date | string
    started_date?: DateTimeNullableWithAggregatesFilter<"Maintenance"> | Date | string | null
    completed_date?: DateTimeNullableWithAggregatesFilter<"Maintenance"> | Date | string | null
    estimated_cost?: DecimalNullableWithAggregatesFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    actual_cost?: DecimalNullableWithAggregatesFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusWithAggregatesFilter<"Maintenance"> | $Enums.MaintenanceStatus
    notes?: StringNullableWithAggregatesFilter<"Maintenance"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Maintenance"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Maintenance"> | Date | string
    is_Active?: BoolWithAggregatesFilter<"Maintenance"> | boolean
  }

  export type MaintenanceDocumentWhereInput = {
    AND?: MaintenanceDocumentWhereInput | MaintenanceDocumentWhereInput[]
    OR?: MaintenanceDocumentWhereInput[]
    NOT?: MaintenanceDocumentWhereInput | MaintenanceDocumentWhereInput[]
    id?: StringFilter<"MaintenanceDocument"> | string
    filename?: StringFilter<"MaintenanceDocument"> | string
    original_name?: StringFilter<"MaintenanceDocument"> | string
    file_path?: StringFilter<"MaintenanceDocument"> | string
    file_size?: IntFilter<"MaintenanceDocument"> | number
    mime_type?: StringFilter<"MaintenanceDocument"> | string
    description?: StringNullableFilter<"MaintenanceDocument"> | string | null
    created_at?: DateTimeFilter<"MaintenanceDocument"> | Date | string
    maintenanceId?: StringNullableFilter<"MaintenanceDocument"> | string | null
    Maintenance?: XOR<MaintenanceNullableScalarRelationFilter, MaintenanceWhereInput> | null
  }

  export type MaintenanceDocumentOrderByWithRelationInput = {
    id?: SortOrder
    filename?: SortOrder
    original_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    mime_type?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    maintenanceId?: SortOrderInput | SortOrder
    Maintenance?: MaintenanceOrderByWithRelationInput
  }

  export type MaintenanceDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MaintenanceDocumentWhereInput | MaintenanceDocumentWhereInput[]
    OR?: MaintenanceDocumentWhereInput[]
    NOT?: MaintenanceDocumentWhereInput | MaintenanceDocumentWhereInput[]
    filename?: StringFilter<"MaintenanceDocument"> | string
    original_name?: StringFilter<"MaintenanceDocument"> | string
    file_path?: StringFilter<"MaintenanceDocument"> | string
    file_size?: IntFilter<"MaintenanceDocument"> | number
    mime_type?: StringFilter<"MaintenanceDocument"> | string
    description?: StringNullableFilter<"MaintenanceDocument"> | string | null
    created_at?: DateTimeFilter<"MaintenanceDocument"> | Date | string
    maintenanceId?: StringNullableFilter<"MaintenanceDocument"> | string | null
    Maintenance?: XOR<MaintenanceNullableScalarRelationFilter, MaintenanceWhereInput> | null
  }, "id">

  export type MaintenanceDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    filename?: SortOrder
    original_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    mime_type?: SortOrder
    description?: SortOrderInput | SortOrder
    created_at?: SortOrder
    maintenanceId?: SortOrderInput | SortOrder
    _count?: MaintenanceDocumentCountOrderByAggregateInput
    _avg?: MaintenanceDocumentAvgOrderByAggregateInput
    _max?: MaintenanceDocumentMaxOrderByAggregateInput
    _min?: MaintenanceDocumentMinOrderByAggregateInput
    _sum?: MaintenanceDocumentSumOrderByAggregateInput
  }

  export type MaintenanceDocumentScalarWhereWithAggregatesInput = {
    AND?: MaintenanceDocumentScalarWhereWithAggregatesInput | MaintenanceDocumentScalarWhereWithAggregatesInput[]
    OR?: MaintenanceDocumentScalarWhereWithAggregatesInput[]
    NOT?: MaintenanceDocumentScalarWhereWithAggregatesInput | MaintenanceDocumentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MaintenanceDocument"> | string
    filename?: StringWithAggregatesFilter<"MaintenanceDocument"> | string
    original_name?: StringWithAggregatesFilter<"MaintenanceDocument"> | string
    file_path?: StringWithAggregatesFilter<"MaintenanceDocument"> | string
    file_size?: IntWithAggregatesFilter<"MaintenanceDocument"> | number
    mime_type?: StringWithAggregatesFilter<"MaintenanceDocument"> | string
    description?: StringNullableWithAggregatesFilter<"MaintenanceDocument"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"MaintenanceDocument"> | Date | string
    maintenanceId?: StringNullableWithAggregatesFilter<"MaintenanceDocument"> | string | null
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password_hash: string
    role?: $Enums.Role
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password_hash: string
    role?: $Enums.Role
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    phone?: string | null
    password_hash: string
    role?: $Enums.Role
    avatar?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    password_hash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetCategoryCreateInput = {
    id?: string
    name: string
    description?: string | null
    type: $Enums.AssetType
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    Asset?: AssetCreateNestedManyWithoutAssetCategoryInput
  }

  export type AssetCategoryUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    type: $Enums.AssetType
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    Asset?: AssetUncheckedCreateNestedManyWithoutAssetCategoryInput
  }

  export type AssetCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    Asset?: AssetUpdateManyWithoutAssetCategoryNestedInput
  }

  export type AssetCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    Asset?: AssetUncheckedUpdateManyWithoutAssetCategoryNestedInput
  }

  export type AssetCategoryCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    type: $Enums.AssetType
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type AssetCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetCreateInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    assetCategory: AssetCategoryCreateNestedOneWithoutAssetInput
    Maintenance?: MaintenanceCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    assetCategoryId: string
    Maintenance?: MaintenanceUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    assetCategory?: AssetCategoryUpdateOneRequiredWithoutAssetNestedInput
    Maintenance?: MaintenanceUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    assetCategoryId?: StringFieldUpdateOperationsInput | string
    Maintenance?: MaintenanceUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetCreateManyInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    assetCategoryId: string
  }

  export type AssetUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    assetCategoryId?: StringFieldUpdateOperationsInput | string
  }

  export type SupplierCreateInput = {
    id?: string
    company_name: string
    trading_name?: string | null
    cnpj: string
    email: string
    phone: string
    contact: string
    address?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    service_types?: SupplierCreateservice_typesInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    Maintenance?: MaintenanceCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUncheckedCreateInput = {
    id?: string
    company_name: string
    trading_name?: string | null
    cnpj: string
    email: string
    phone: string
    contact: string
    address?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    service_types?: SupplierCreateservice_typesInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    Maintenance?: MaintenanceUncheckedCreateNestedManyWithoutSupplierInput
  }

  export type SupplierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    trading_name?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip_code?: NullableStringFieldUpdateOperationsInput | string | null
    service_types?: SupplierUpdateservice_typesInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    Maintenance?: MaintenanceUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    trading_name?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip_code?: NullableStringFieldUpdateOperationsInput | string | null
    service_types?: SupplierUpdateservice_typesInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    Maintenance?: MaintenanceUncheckedUpdateManyWithoutSupplierNestedInput
  }

  export type SupplierCreateManyInput = {
    id?: string
    company_name: string
    trading_name?: string | null
    cnpj: string
    email: string
    phone: string
    contact: string
    address?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    service_types?: SupplierCreateservice_typesInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type SupplierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    trading_name?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip_code?: NullableStringFieldUpdateOperationsInput | string | null
    service_types?: SupplierUpdateservice_typesInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SupplierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    trading_name?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip_code?: NullableStringFieldUpdateOperationsInput | string | null
    service_types?: SupplierUpdateservice_typesInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceCreateInput = {
    id?: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    asset: AssetCreateNestedOneWithoutMaintenanceInput
    supplier: SupplierCreateNestedOneWithoutMaintenanceInput
    documents?: MaintenanceDocumentCreateNestedManyWithoutMaintenanceInput
  }

  export type MaintenanceUncheckedCreateInput = {
    id?: string
    assetId: string
    supplierId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    documents?: MaintenanceDocumentUncheckedCreateNestedManyWithoutMaintenanceInput
  }

  export type MaintenanceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    asset?: AssetUpdateOneRequiredWithoutMaintenanceNestedInput
    supplier?: SupplierUpdateOneRequiredWithoutMaintenanceNestedInput
    documents?: MaintenanceDocumentUpdateManyWithoutMaintenanceNestedInput
  }

  export type MaintenanceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    documents?: MaintenanceDocumentUncheckedUpdateManyWithoutMaintenanceNestedInput
  }

  export type MaintenanceCreateManyInput = {
    id?: string
    assetId: string
    supplierId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type MaintenanceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceDocumentCreateInput = {
    id?: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description?: string | null
    created_at?: Date | string
    Maintenance?: MaintenanceCreateNestedOneWithoutDocumentsInput
  }

  export type MaintenanceDocumentUncheckedCreateInput = {
    id?: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description?: string | null
    created_at?: Date | string
    maintenanceId?: string | null
  }

  export type MaintenanceDocumentUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    Maintenance?: MaintenanceUpdateOneWithoutDocumentsNestedInput
  }

  export type MaintenanceDocumentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    maintenanceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type MaintenanceDocumentCreateManyInput = {
    id?: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description?: string | null
    created_at?: Date | string
    maintenanceId?: string | null
  }

  export type MaintenanceDocumentUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceDocumentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    maintenanceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    password_hash?: SortOrder
    role?: SortOrder
    avatar?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumAssetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetTypeFilter<$PrismaModel> | $Enums.AssetType
  }

  export type AssetListRelationFilter = {
    every?: AssetWhereInput
    some?: AssetWhereInput
    none?: AssetWhereInput
  }

  export type AssetOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type AssetCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type AssetCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    type?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type EnumAssetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssetType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetTypeFilter<$PrismaModel>
    _max?: NestedEnumAssetTypeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type EnumAssetOwnershipFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetOwnership | EnumAssetOwnershipFieldRefInput<$PrismaModel>
    in?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetOwnershipFilter<$PrismaModel> | $Enums.AssetOwnership
  }

  export type AssetCategoryScalarRelationFilter = {
    is?: AssetCategoryWhereInput
    isNot?: AssetCategoryWhereInput
  }

  export type MaintenanceListRelationFilter = {
    every?: MaintenanceWhereInput
    some?: MaintenanceWhereInput
    none?: MaintenanceWhereInput
  }

  export type MaintenanceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AssetCountOrderByAggregateInput = {
    id?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    year?: SortOrder
    plate?: SortOrder
    serial_number?: SortOrder
    ownership?: SortOrder
    documentsUrl?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    assetCategoryId?: SortOrder
  }

  export type AssetAvgOrderByAggregateInput = {
    year?: SortOrder
  }

  export type AssetMaxOrderByAggregateInput = {
    id?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    year?: SortOrder
    plate?: SortOrder
    serial_number?: SortOrder
    ownership?: SortOrder
    documentsUrl?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    assetCategoryId?: SortOrder
  }

  export type AssetMinOrderByAggregateInput = {
    id?: SortOrder
    brand?: SortOrder
    model?: SortOrder
    year?: SortOrder
    plate?: SortOrder
    serial_number?: SortOrder
    ownership?: SortOrder
    documentsUrl?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
    assetCategoryId?: SortOrder
  }

  export type AssetSumOrderByAggregateInput = {
    year?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumAssetOwnershipWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetOwnership | EnumAssetOwnershipFieldRefInput<$PrismaModel>
    in?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetOwnershipWithAggregatesFilter<$PrismaModel> | $Enums.AssetOwnership
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetOwnershipFilter<$PrismaModel>
    _max?: NestedEnumAssetOwnershipFilter<$PrismaModel>
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type SupplierCountOrderByAggregateInput = {
    id?: SortOrder
    company_name?: SortOrder
    trading_name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip_code?: SortOrder
    service_types?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type SupplierMaxOrderByAggregateInput = {
    id?: SortOrder
    company_name?: SortOrder
    trading_name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip_code?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type SupplierMinOrderByAggregateInput = {
    id?: SortOrder
    company_name?: SortOrder
    trading_name?: SortOrder
    cnpj?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    contact?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    zip_code?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type EnumMaintenanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeFilter<$PrismaModel> | $Enums.MaintenanceType
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type EnumMaintenanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusFilter<$PrismaModel> | $Enums.MaintenanceStatus
  }

  export type AssetScalarRelationFilter = {
    is?: AssetWhereInput
    isNot?: AssetWhereInput
  }

  export type SupplierScalarRelationFilter = {
    is?: SupplierWhereInput
    isNot?: SupplierWhereInput
  }

  export type MaintenanceDocumentListRelationFilter = {
    every?: MaintenanceDocumentWhereInput
    some?: MaintenanceDocumentWhereInput
    none?: MaintenanceDocumentWhereInput
  }

  export type MaintenanceDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MaintenanceCountOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    supplierId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    scheduled_date?: SortOrder
    started_date?: SortOrder
    completed_date?: SortOrder
    estimated_cost?: SortOrder
    actual_cost?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type MaintenanceAvgOrderByAggregateInput = {
    estimated_cost?: SortOrder
    actual_cost?: SortOrder
  }

  export type MaintenanceMaxOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    supplierId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    scheduled_date?: SortOrder
    started_date?: SortOrder
    completed_date?: SortOrder
    estimated_cost?: SortOrder
    actual_cost?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type MaintenanceMinOrderByAggregateInput = {
    id?: SortOrder
    assetId?: SortOrder
    supplierId?: SortOrder
    type?: SortOrder
    description?: SortOrder
    scheduled_date?: SortOrder
    started_date?: SortOrder
    completed_date?: SortOrder
    estimated_cost?: SortOrder
    actual_cost?: SortOrder
    status?: SortOrder
    notes?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    is_Active?: SortOrder
  }

  export type MaintenanceSumOrderByAggregateInput = {
    estimated_cost?: SortOrder
    actual_cost?: SortOrder
  }

  export type EnumMaintenanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type EnumMaintenanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type MaintenanceNullableScalarRelationFilter = {
    is?: MaintenanceWhereInput | null
    isNot?: MaintenanceWhereInput | null
  }

  export type MaintenanceDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    original_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    mime_type?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    maintenanceId?: SortOrder
  }

  export type MaintenanceDocumentAvgOrderByAggregateInput = {
    file_size?: SortOrder
  }

  export type MaintenanceDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    original_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    mime_type?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    maintenanceId?: SortOrder
  }

  export type MaintenanceDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    filename?: SortOrder
    original_name?: SortOrder
    file_path?: SortOrder
    file_size?: SortOrder
    mime_type?: SortOrder
    description?: SortOrder
    created_at?: SortOrder
    maintenanceId?: SortOrder
  }

  export type MaintenanceDocumentSumOrderByAggregateInput = {
    file_size?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type AssetCreateNestedManyWithoutAssetCategoryInput = {
    create?: XOR<AssetCreateWithoutAssetCategoryInput, AssetUncheckedCreateWithoutAssetCategoryInput> | AssetCreateWithoutAssetCategoryInput[] | AssetUncheckedCreateWithoutAssetCategoryInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetCategoryInput | AssetCreateOrConnectWithoutAssetCategoryInput[]
    createMany?: AssetCreateManyAssetCategoryInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type AssetUncheckedCreateNestedManyWithoutAssetCategoryInput = {
    create?: XOR<AssetCreateWithoutAssetCategoryInput, AssetUncheckedCreateWithoutAssetCategoryInput> | AssetCreateWithoutAssetCategoryInput[] | AssetUncheckedCreateWithoutAssetCategoryInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetCategoryInput | AssetCreateOrConnectWithoutAssetCategoryInput[]
    createMany?: AssetCreateManyAssetCategoryInputEnvelope
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
  }

  export type EnumAssetTypeFieldUpdateOperationsInput = {
    set?: $Enums.AssetType
  }

  export type AssetUpdateManyWithoutAssetCategoryNestedInput = {
    create?: XOR<AssetCreateWithoutAssetCategoryInput, AssetUncheckedCreateWithoutAssetCategoryInput> | AssetCreateWithoutAssetCategoryInput[] | AssetUncheckedCreateWithoutAssetCategoryInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetCategoryInput | AssetCreateOrConnectWithoutAssetCategoryInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutAssetCategoryInput | AssetUpsertWithWhereUniqueWithoutAssetCategoryInput[]
    createMany?: AssetCreateManyAssetCategoryInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutAssetCategoryInput | AssetUpdateWithWhereUniqueWithoutAssetCategoryInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutAssetCategoryInput | AssetUpdateManyWithWhereWithoutAssetCategoryInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetUncheckedUpdateManyWithoutAssetCategoryNestedInput = {
    create?: XOR<AssetCreateWithoutAssetCategoryInput, AssetUncheckedCreateWithoutAssetCategoryInput> | AssetCreateWithoutAssetCategoryInput[] | AssetUncheckedCreateWithoutAssetCategoryInput[]
    connectOrCreate?: AssetCreateOrConnectWithoutAssetCategoryInput | AssetCreateOrConnectWithoutAssetCategoryInput[]
    upsert?: AssetUpsertWithWhereUniqueWithoutAssetCategoryInput | AssetUpsertWithWhereUniqueWithoutAssetCategoryInput[]
    createMany?: AssetCreateManyAssetCategoryInputEnvelope
    set?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    disconnect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    delete?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    connect?: AssetWhereUniqueInput | AssetWhereUniqueInput[]
    update?: AssetUpdateWithWhereUniqueWithoutAssetCategoryInput | AssetUpdateWithWhereUniqueWithoutAssetCategoryInput[]
    updateMany?: AssetUpdateManyWithWhereWithoutAssetCategoryInput | AssetUpdateManyWithWhereWithoutAssetCategoryInput[]
    deleteMany?: AssetScalarWhereInput | AssetScalarWhereInput[]
  }

  export type AssetCategoryCreateNestedOneWithoutAssetInput = {
    create?: XOR<AssetCategoryCreateWithoutAssetInput, AssetCategoryUncheckedCreateWithoutAssetInput>
    connectOrCreate?: AssetCategoryCreateOrConnectWithoutAssetInput
    connect?: AssetCategoryWhereUniqueInput
  }

  export type MaintenanceCreateNestedManyWithoutAssetInput = {
    create?: XOR<MaintenanceCreateWithoutAssetInput, MaintenanceUncheckedCreateWithoutAssetInput> | MaintenanceCreateWithoutAssetInput[] | MaintenanceUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutAssetInput | MaintenanceCreateOrConnectWithoutAssetInput[]
    createMany?: MaintenanceCreateManyAssetInputEnvelope
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
  }

  export type MaintenanceUncheckedCreateNestedManyWithoutAssetInput = {
    create?: XOR<MaintenanceCreateWithoutAssetInput, MaintenanceUncheckedCreateWithoutAssetInput> | MaintenanceCreateWithoutAssetInput[] | MaintenanceUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutAssetInput | MaintenanceCreateOrConnectWithoutAssetInput[]
    createMany?: MaintenanceCreateManyAssetInputEnvelope
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumAssetOwnershipFieldUpdateOperationsInput = {
    set?: $Enums.AssetOwnership
  }

  export type AssetCategoryUpdateOneRequiredWithoutAssetNestedInput = {
    create?: XOR<AssetCategoryCreateWithoutAssetInput, AssetCategoryUncheckedCreateWithoutAssetInput>
    connectOrCreate?: AssetCategoryCreateOrConnectWithoutAssetInput
    upsert?: AssetCategoryUpsertWithoutAssetInput
    connect?: AssetCategoryWhereUniqueInput
    update?: XOR<XOR<AssetCategoryUpdateToOneWithWhereWithoutAssetInput, AssetCategoryUpdateWithoutAssetInput>, AssetCategoryUncheckedUpdateWithoutAssetInput>
  }

  export type MaintenanceUpdateManyWithoutAssetNestedInput = {
    create?: XOR<MaintenanceCreateWithoutAssetInput, MaintenanceUncheckedCreateWithoutAssetInput> | MaintenanceCreateWithoutAssetInput[] | MaintenanceUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutAssetInput | MaintenanceCreateOrConnectWithoutAssetInput[]
    upsert?: MaintenanceUpsertWithWhereUniqueWithoutAssetInput | MaintenanceUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: MaintenanceCreateManyAssetInputEnvelope
    set?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    disconnect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    delete?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    update?: MaintenanceUpdateWithWhereUniqueWithoutAssetInput | MaintenanceUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: MaintenanceUpdateManyWithWhereWithoutAssetInput | MaintenanceUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: MaintenanceScalarWhereInput | MaintenanceScalarWhereInput[]
  }

  export type MaintenanceUncheckedUpdateManyWithoutAssetNestedInput = {
    create?: XOR<MaintenanceCreateWithoutAssetInput, MaintenanceUncheckedCreateWithoutAssetInput> | MaintenanceCreateWithoutAssetInput[] | MaintenanceUncheckedCreateWithoutAssetInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutAssetInput | MaintenanceCreateOrConnectWithoutAssetInput[]
    upsert?: MaintenanceUpsertWithWhereUniqueWithoutAssetInput | MaintenanceUpsertWithWhereUniqueWithoutAssetInput[]
    createMany?: MaintenanceCreateManyAssetInputEnvelope
    set?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    disconnect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    delete?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    update?: MaintenanceUpdateWithWhereUniqueWithoutAssetInput | MaintenanceUpdateWithWhereUniqueWithoutAssetInput[]
    updateMany?: MaintenanceUpdateManyWithWhereWithoutAssetInput | MaintenanceUpdateManyWithWhereWithoutAssetInput[]
    deleteMany?: MaintenanceScalarWhereInput | MaintenanceScalarWhereInput[]
  }

  export type SupplierCreateservice_typesInput = {
    set: string[]
  }

  export type MaintenanceCreateNestedManyWithoutSupplierInput = {
    create?: XOR<MaintenanceCreateWithoutSupplierInput, MaintenanceUncheckedCreateWithoutSupplierInput> | MaintenanceCreateWithoutSupplierInput[] | MaintenanceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutSupplierInput | MaintenanceCreateOrConnectWithoutSupplierInput[]
    createMany?: MaintenanceCreateManySupplierInputEnvelope
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
  }

  export type MaintenanceUncheckedCreateNestedManyWithoutSupplierInput = {
    create?: XOR<MaintenanceCreateWithoutSupplierInput, MaintenanceUncheckedCreateWithoutSupplierInput> | MaintenanceCreateWithoutSupplierInput[] | MaintenanceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutSupplierInput | MaintenanceCreateOrConnectWithoutSupplierInput[]
    createMany?: MaintenanceCreateManySupplierInputEnvelope
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
  }

  export type SupplierUpdateservice_typesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type MaintenanceUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<MaintenanceCreateWithoutSupplierInput, MaintenanceUncheckedCreateWithoutSupplierInput> | MaintenanceCreateWithoutSupplierInput[] | MaintenanceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutSupplierInput | MaintenanceCreateOrConnectWithoutSupplierInput[]
    upsert?: MaintenanceUpsertWithWhereUniqueWithoutSupplierInput | MaintenanceUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: MaintenanceCreateManySupplierInputEnvelope
    set?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    disconnect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    delete?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    update?: MaintenanceUpdateWithWhereUniqueWithoutSupplierInput | MaintenanceUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: MaintenanceUpdateManyWithWhereWithoutSupplierInput | MaintenanceUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: MaintenanceScalarWhereInput | MaintenanceScalarWhereInput[]
  }

  export type MaintenanceUncheckedUpdateManyWithoutSupplierNestedInput = {
    create?: XOR<MaintenanceCreateWithoutSupplierInput, MaintenanceUncheckedCreateWithoutSupplierInput> | MaintenanceCreateWithoutSupplierInput[] | MaintenanceUncheckedCreateWithoutSupplierInput[]
    connectOrCreate?: MaintenanceCreateOrConnectWithoutSupplierInput | MaintenanceCreateOrConnectWithoutSupplierInput[]
    upsert?: MaintenanceUpsertWithWhereUniqueWithoutSupplierInput | MaintenanceUpsertWithWhereUniqueWithoutSupplierInput[]
    createMany?: MaintenanceCreateManySupplierInputEnvelope
    set?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    disconnect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    delete?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    connect?: MaintenanceWhereUniqueInput | MaintenanceWhereUniqueInput[]
    update?: MaintenanceUpdateWithWhereUniqueWithoutSupplierInput | MaintenanceUpdateWithWhereUniqueWithoutSupplierInput[]
    updateMany?: MaintenanceUpdateManyWithWhereWithoutSupplierInput | MaintenanceUpdateManyWithWhereWithoutSupplierInput[]
    deleteMany?: MaintenanceScalarWhereInput | MaintenanceScalarWhereInput[]
  }

  export type AssetCreateNestedOneWithoutMaintenanceInput = {
    create?: XOR<AssetCreateWithoutMaintenanceInput, AssetUncheckedCreateWithoutMaintenanceInput>
    connectOrCreate?: AssetCreateOrConnectWithoutMaintenanceInput
    connect?: AssetWhereUniqueInput
  }

  export type SupplierCreateNestedOneWithoutMaintenanceInput = {
    create?: XOR<SupplierCreateWithoutMaintenanceInput, SupplierUncheckedCreateWithoutMaintenanceInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutMaintenanceInput
    connect?: SupplierWhereUniqueInput
  }

  export type MaintenanceDocumentCreateNestedManyWithoutMaintenanceInput = {
    create?: XOR<MaintenanceDocumentCreateWithoutMaintenanceInput, MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput> | MaintenanceDocumentCreateWithoutMaintenanceInput[] | MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput[]
    connectOrCreate?: MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput | MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput[]
    createMany?: MaintenanceDocumentCreateManyMaintenanceInputEnvelope
    connect?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
  }

  export type MaintenanceDocumentUncheckedCreateNestedManyWithoutMaintenanceInput = {
    create?: XOR<MaintenanceDocumentCreateWithoutMaintenanceInput, MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput> | MaintenanceDocumentCreateWithoutMaintenanceInput[] | MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput[]
    connectOrCreate?: MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput | MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput[]
    createMany?: MaintenanceDocumentCreateManyMaintenanceInputEnvelope
    connect?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
  }

  export type EnumMaintenanceTypeFieldUpdateOperationsInput = {
    set?: $Enums.MaintenanceType
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumMaintenanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.MaintenanceStatus
  }

  export type AssetUpdateOneRequiredWithoutMaintenanceNestedInput = {
    create?: XOR<AssetCreateWithoutMaintenanceInput, AssetUncheckedCreateWithoutMaintenanceInput>
    connectOrCreate?: AssetCreateOrConnectWithoutMaintenanceInput
    upsert?: AssetUpsertWithoutMaintenanceInput
    connect?: AssetWhereUniqueInput
    update?: XOR<XOR<AssetUpdateToOneWithWhereWithoutMaintenanceInput, AssetUpdateWithoutMaintenanceInput>, AssetUncheckedUpdateWithoutMaintenanceInput>
  }

  export type SupplierUpdateOneRequiredWithoutMaintenanceNestedInput = {
    create?: XOR<SupplierCreateWithoutMaintenanceInput, SupplierUncheckedCreateWithoutMaintenanceInput>
    connectOrCreate?: SupplierCreateOrConnectWithoutMaintenanceInput
    upsert?: SupplierUpsertWithoutMaintenanceInput
    connect?: SupplierWhereUniqueInput
    update?: XOR<XOR<SupplierUpdateToOneWithWhereWithoutMaintenanceInput, SupplierUpdateWithoutMaintenanceInput>, SupplierUncheckedUpdateWithoutMaintenanceInput>
  }

  export type MaintenanceDocumentUpdateManyWithoutMaintenanceNestedInput = {
    create?: XOR<MaintenanceDocumentCreateWithoutMaintenanceInput, MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput> | MaintenanceDocumentCreateWithoutMaintenanceInput[] | MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput[]
    connectOrCreate?: MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput | MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput[]
    upsert?: MaintenanceDocumentUpsertWithWhereUniqueWithoutMaintenanceInput | MaintenanceDocumentUpsertWithWhereUniqueWithoutMaintenanceInput[]
    createMany?: MaintenanceDocumentCreateManyMaintenanceInputEnvelope
    set?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    disconnect?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    delete?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    connect?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    update?: MaintenanceDocumentUpdateWithWhereUniqueWithoutMaintenanceInput | MaintenanceDocumentUpdateWithWhereUniqueWithoutMaintenanceInput[]
    updateMany?: MaintenanceDocumentUpdateManyWithWhereWithoutMaintenanceInput | MaintenanceDocumentUpdateManyWithWhereWithoutMaintenanceInput[]
    deleteMany?: MaintenanceDocumentScalarWhereInput | MaintenanceDocumentScalarWhereInput[]
  }

  export type MaintenanceDocumentUncheckedUpdateManyWithoutMaintenanceNestedInput = {
    create?: XOR<MaintenanceDocumentCreateWithoutMaintenanceInput, MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput> | MaintenanceDocumentCreateWithoutMaintenanceInput[] | MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput[]
    connectOrCreate?: MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput | MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput[]
    upsert?: MaintenanceDocumentUpsertWithWhereUniqueWithoutMaintenanceInput | MaintenanceDocumentUpsertWithWhereUniqueWithoutMaintenanceInput[]
    createMany?: MaintenanceDocumentCreateManyMaintenanceInputEnvelope
    set?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    disconnect?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    delete?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    connect?: MaintenanceDocumentWhereUniqueInput | MaintenanceDocumentWhereUniqueInput[]
    update?: MaintenanceDocumentUpdateWithWhereUniqueWithoutMaintenanceInput | MaintenanceDocumentUpdateWithWhereUniqueWithoutMaintenanceInput[]
    updateMany?: MaintenanceDocumentUpdateManyWithWhereWithoutMaintenanceInput | MaintenanceDocumentUpdateManyWithWhereWithoutMaintenanceInput[]
    deleteMany?: MaintenanceDocumentScalarWhereInput | MaintenanceDocumentScalarWhereInput[]
  }

  export type MaintenanceCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<MaintenanceCreateWithoutDocumentsInput, MaintenanceUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: MaintenanceCreateOrConnectWithoutDocumentsInput
    connect?: MaintenanceWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MaintenanceUpdateOneWithoutDocumentsNestedInput = {
    create?: XOR<MaintenanceCreateWithoutDocumentsInput, MaintenanceUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: MaintenanceCreateOrConnectWithoutDocumentsInput
    upsert?: MaintenanceUpsertWithoutDocumentsInput
    disconnect?: MaintenanceWhereInput | boolean
    delete?: MaintenanceWhereInput | boolean
    connect?: MaintenanceWhereUniqueInput
    update?: XOR<XOR<MaintenanceUpdateToOneWithWhereWithoutDocumentsInput, MaintenanceUpdateWithoutDocumentsInput>, MaintenanceUncheckedUpdateWithoutDocumentsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumAssetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetTypeFilter<$PrismaModel> | $Enums.AssetType
  }

  export type NestedEnumAssetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetType | EnumAssetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetType[] | ListEnumAssetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetTypeWithAggregatesFilter<$PrismaModel> | $Enums.AssetType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetTypeFilter<$PrismaModel>
    _max?: NestedEnumAssetTypeFilter<$PrismaModel>
  }

  export type NestedEnumAssetOwnershipFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetOwnership | EnumAssetOwnershipFieldRefInput<$PrismaModel>
    in?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetOwnershipFilter<$PrismaModel> | $Enums.AssetOwnership
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumAssetOwnershipWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AssetOwnership | EnumAssetOwnershipFieldRefInput<$PrismaModel>
    in?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    notIn?: $Enums.AssetOwnership[] | ListEnumAssetOwnershipFieldRefInput<$PrismaModel>
    not?: NestedEnumAssetOwnershipWithAggregatesFilter<$PrismaModel> | $Enums.AssetOwnership
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAssetOwnershipFilter<$PrismaModel>
    _max?: NestedEnumAssetOwnershipFilter<$PrismaModel>
  }

  export type NestedEnumMaintenanceTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeFilter<$PrismaModel> | $Enums.MaintenanceType
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedEnumMaintenanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusFilter<$PrismaModel> | $Enums.MaintenanceStatus
  }

  export type NestedEnumMaintenanceTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceType | EnumMaintenanceTypeFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceType[] | ListEnumMaintenanceTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceTypeWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceTypeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedEnumMaintenanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MaintenanceStatus | EnumMaintenanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.MaintenanceStatus[] | ListEnumMaintenanceStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumMaintenanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.MaintenanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
    _max?: NestedEnumMaintenanceStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type AssetCreateWithoutAssetCategoryInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    Maintenance?: MaintenanceCreateNestedManyWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutAssetCategoryInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    Maintenance?: MaintenanceUncheckedCreateNestedManyWithoutAssetInput
  }

  export type AssetCreateOrConnectWithoutAssetCategoryInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutAssetCategoryInput, AssetUncheckedCreateWithoutAssetCategoryInput>
  }

  export type AssetCreateManyAssetCategoryInputEnvelope = {
    data: AssetCreateManyAssetCategoryInput | AssetCreateManyAssetCategoryInput[]
    skipDuplicates?: boolean
  }

  export type AssetUpsertWithWhereUniqueWithoutAssetCategoryInput = {
    where: AssetWhereUniqueInput
    update: XOR<AssetUpdateWithoutAssetCategoryInput, AssetUncheckedUpdateWithoutAssetCategoryInput>
    create: XOR<AssetCreateWithoutAssetCategoryInput, AssetUncheckedCreateWithoutAssetCategoryInput>
  }

  export type AssetUpdateWithWhereUniqueWithoutAssetCategoryInput = {
    where: AssetWhereUniqueInput
    data: XOR<AssetUpdateWithoutAssetCategoryInput, AssetUncheckedUpdateWithoutAssetCategoryInput>
  }

  export type AssetUpdateManyWithWhereWithoutAssetCategoryInput = {
    where: AssetScalarWhereInput
    data: XOR<AssetUpdateManyMutationInput, AssetUncheckedUpdateManyWithoutAssetCategoryInput>
  }

  export type AssetScalarWhereInput = {
    AND?: AssetScalarWhereInput | AssetScalarWhereInput[]
    OR?: AssetScalarWhereInput[]
    NOT?: AssetScalarWhereInput | AssetScalarWhereInput[]
    id?: StringFilter<"Asset"> | string
    brand?: StringFilter<"Asset"> | string
    model?: StringFilter<"Asset"> | string
    year?: IntNullableFilter<"Asset"> | number | null
    plate?: StringNullableFilter<"Asset"> | string | null
    serial_number?: StringNullableFilter<"Asset"> | string | null
    ownership?: EnumAssetOwnershipFilter<"Asset"> | $Enums.AssetOwnership
    documentsUrl?: StringNullableFilter<"Asset"> | string | null
    created_at?: DateTimeFilter<"Asset"> | Date | string
    updated_at?: DateTimeFilter<"Asset"> | Date | string
    is_Active?: BoolFilter<"Asset"> | boolean
    assetCategoryId?: StringFilter<"Asset"> | string
  }

  export type AssetCategoryCreateWithoutAssetInput = {
    id?: string
    name: string
    description?: string | null
    type: $Enums.AssetType
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type AssetCategoryUncheckedCreateWithoutAssetInput = {
    id?: string
    name: string
    description?: string | null
    type: $Enums.AssetType
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type AssetCategoryCreateOrConnectWithoutAssetInput = {
    where: AssetCategoryWhereUniqueInput
    create: XOR<AssetCategoryCreateWithoutAssetInput, AssetCategoryUncheckedCreateWithoutAssetInput>
  }

  export type MaintenanceCreateWithoutAssetInput = {
    id?: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    supplier: SupplierCreateNestedOneWithoutMaintenanceInput
    documents?: MaintenanceDocumentCreateNestedManyWithoutMaintenanceInput
  }

  export type MaintenanceUncheckedCreateWithoutAssetInput = {
    id?: string
    supplierId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    documents?: MaintenanceDocumentUncheckedCreateNestedManyWithoutMaintenanceInput
  }

  export type MaintenanceCreateOrConnectWithoutAssetInput = {
    where: MaintenanceWhereUniqueInput
    create: XOR<MaintenanceCreateWithoutAssetInput, MaintenanceUncheckedCreateWithoutAssetInput>
  }

  export type MaintenanceCreateManyAssetInputEnvelope = {
    data: MaintenanceCreateManyAssetInput | MaintenanceCreateManyAssetInput[]
    skipDuplicates?: boolean
  }

  export type AssetCategoryUpsertWithoutAssetInput = {
    update: XOR<AssetCategoryUpdateWithoutAssetInput, AssetCategoryUncheckedUpdateWithoutAssetInput>
    create: XOR<AssetCategoryCreateWithoutAssetInput, AssetCategoryUncheckedCreateWithoutAssetInput>
    where?: AssetCategoryWhereInput
  }

  export type AssetCategoryUpdateToOneWithWhereWithoutAssetInput = {
    where?: AssetCategoryWhereInput
    data: XOR<AssetCategoryUpdateWithoutAssetInput, AssetCategoryUncheckedUpdateWithoutAssetInput>
  }

  export type AssetCategoryUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetCategoryUncheckedUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    type?: EnumAssetTypeFieldUpdateOperationsInput | $Enums.AssetType
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceUpsertWithWhereUniqueWithoutAssetInput = {
    where: MaintenanceWhereUniqueInput
    update: XOR<MaintenanceUpdateWithoutAssetInput, MaintenanceUncheckedUpdateWithoutAssetInput>
    create: XOR<MaintenanceCreateWithoutAssetInput, MaintenanceUncheckedCreateWithoutAssetInput>
  }

  export type MaintenanceUpdateWithWhereUniqueWithoutAssetInput = {
    where: MaintenanceWhereUniqueInput
    data: XOR<MaintenanceUpdateWithoutAssetInput, MaintenanceUncheckedUpdateWithoutAssetInput>
  }

  export type MaintenanceUpdateManyWithWhereWithoutAssetInput = {
    where: MaintenanceScalarWhereInput
    data: XOR<MaintenanceUpdateManyMutationInput, MaintenanceUncheckedUpdateManyWithoutAssetInput>
  }

  export type MaintenanceScalarWhereInput = {
    AND?: MaintenanceScalarWhereInput | MaintenanceScalarWhereInput[]
    OR?: MaintenanceScalarWhereInput[]
    NOT?: MaintenanceScalarWhereInput | MaintenanceScalarWhereInput[]
    id?: StringFilter<"Maintenance"> | string
    assetId?: StringFilter<"Maintenance"> | string
    supplierId?: StringFilter<"Maintenance"> | string
    type?: EnumMaintenanceTypeFilter<"Maintenance"> | $Enums.MaintenanceType
    description?: StringFilter<"Maintenance"> | string
    scheduled_date?: DateTimeFilter<"Maintenance"> | Date | string
    started_date?: DateTimeNullableFilter<"Maintenance"> | Date | string | null
    completed_date?: DateTimeNullableFilter<"Maintenance"> | Date | string | null
    estimated_cost?: DecimalNullableFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    actual_cost?: DecimalNullableFilter<"Maintenance"> | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFilter<"Maintenance"> | $Enums.MaintenanceStatus
    notes?: StringNullableFilter<"Maintenance"> | string | null
    created_at?: DateTimeFilter<"Maintenance"> | Date | string
    updated_at?: DateTimeFilter<"Maintenance"> | Date | string
    is_Active?: BoolFilter<"Maintenance"> | boolean
  }

  export type MaintenanceCreateWithoutSupplierInput = {
    id?: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    asset: AssetCreateNestedOneWithoutMaintenanceInput
    documents?: MaintenanceDocumentCreateNestedManyWithoutMaintenanceInput
  }

  export type MaintenanceUncheckedCreateWithoutSupplierInput = {
    id?: string
    assetId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    documents?: MaintenanceDocumentUncheckedCreateNestedManyWithoutMaintenanceInput
  }

  export type MaintenanceCreateOrConnectWithoutSupplierInput = {
    where: MaintenanceWhereUniqueInput
    create: XOR<MaintenanceCreateWithoutSupplierInput, MaintenanceUncheckedCreateWithoutSupplierInput>
  }

  export type MaintenanceCreateManySupplierInputEnvelope = {
    data: MaintenanceCreateManySupplierInput | MaintenanceCreateManySupplierInput[]
    skipDuplicates?: boolean
  }

  export type MaintenanceUpsertWithWhereUniqueWithoutSupplierInput = {
    where: MaintenanceWhereUniqueInput
    update: XOR<MaintenanceUpdateWithoutSupplierInput, MaintenanceUncheckedUpdateWithoutSupplierInput>
    create: XOR<MaintenanceCreateWithoutSupplierInput, MaintenanceUncheckedCreateWithoutSupplierInput>
  }

  export type MaintenanceUpdateWithWhereUniqueWithoutSupplierInput = {
    where: MaintenanceWhereUniqueInput
    data: XOR<MaintenanceUpdateWithoutSupplierInput, MaintenanceUncheckedUpdateWithoutSupplierInput>
  }

  export type MaintenanceUpdateManyWithWhereWithoutSupplierInput = {
    where: MaintenanceScalarWhereInput
    data: XOR<MaintenanceUpdateManyMutationInput, MaintenanceUncheckedUpdateManyWithoutSupplierInput>
  }

  export type AssetCreateWithoutMaintenanceInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    assetCategory: AssetCategoryCreateNestedOneWithoutAssetInput
  }

  export type AssetUncheckedCreateWithoutMaintenanceInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    assetCategoryId: string
  }

  export type AssetCreateOrConnectWithoutMaintenanceInput = {
    where: AssetWhereUniqueInput
    create: XOR<AssetCreateWithoutMaintenanceInput, AssetUncheckedCreateWithoutMaintenanceInput>
  }

  export type SupplierCreateWithoutMaintenanceInput = {
    id?: string
    company_name: string
    trading_name?: string | null
    cnpj: string
    email: string
    phone: string
    contact: string
    address?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    service_types?: SupplierCreateservice_typesInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type SupplierUncheckedCreateWithoutMaintenanceInput = {
    id?: string
    company_name: string
    trading_name?: string | null
    cnpj: string
    email: string
    phone: string
    contact: string
    address?: string | null
    city?: string | null
    state?: string | null
    zip_code?: string | null
    service_types?: SupplierCreateservice_typesInput | string[]
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type SupplierCreateOrConnectWithoutMaintenanceInput = {
    where: SupplierWhereUniqueInput
    create: XOR<SupplierCreateWithoutMaintenanceInput, SupplierUncheckedCreateWithoutMaintenanceInput>
  }

  export type MaintenanceDocumentCreateWithoutMaintenanceInput = {
    id?: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description?: string | null
    created_at?: Date | string
  }

  export type MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput = {
    id?: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description?: string | null
    created_at?: Date | string
  }

  export type MaintenanceDocumentCreateOrConnectWithoutMaintenanceInput = {
    where: MaintenanceDocumentWhereUniqueInput
    create: XOR<MaintenanceDocumentCreateWithoutMaintenanceInput, MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput>
  }

  export type MaintenanceDocumentCreateManyMaintenanceInputEnvelope = {
    data: MaintenanceDocumentCreateManyMaintenanceInput | MaintenanceDocumentCreateManyMaintenanceInput[]
    skipDuplicates?: boolean
  }

  export type AssetUpsertWithoutMaintenanceInput = {
    update: XOR<AssetUpdateWithoutMaintenanceInput, AssetUncheckedUpdateWithoutMaintenanceInput>
    create: XOR<AssetCreateWithoutMaintenanceInput, AssetUncheckedCreateWithoutMaintenanceInput>
    where?: AssetWhereInput
  }

  export type AssetUpdateToOneWithWhereWithoutMaintenanceInput = {
    where?: AssetWhereInput
    data: XOR<AssetUpdateWithoutMaintenanceInput, AssetUncheckedUpdateWithoutMaintenanceInput>
  }

  export type AssetUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    assetCategory?: AssetCategoryUpdateOneRequiredWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    assetCategoryId?: StringFieldUpdateOperationsInput | string
  }

  export type SupplierUpsertWithoutMaintenanceInput = {
    update: XOR<SupplierUpdateWithoutMaintenanceInput, SupplierUncheckedUpdateWithoutMaintenanceInput>
    create: XOR<SupplierCreateWithoutMaintenanceInput, SupplierUncheckedCreateWithoutMaintenanceInput>
    where?: SupplierWhereInput
  }

  export type SupplierUpdateToOneWithWhereWithoutMaintenanceInput = {
    where?: SupplierWhereInput
    data: XOR<SupplierUpdateWithoutMaintenanceInput, SupplierUncheckedUpdateWithoutMaintenanceInput>
  }

  export type SupplierUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    trading_name?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip_code?: NullableStringFieldUpdateOperationsInput | string | null
    service_types?: SupplierUpdateservice_typesInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SupplierUncheckedUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_name?: StringFieldUpdateOperationsInput | string
    trading_name?: NullableStringFieldUpdateOperationsInput | string | null
    cnpj?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    contact?: StringFieldUpdateOperationsInput | string
    address?: NullableStringFieldUpdateOperationsInput | string | null
    city?: NullableStringFieldUpdateOperationsInput | string | null
    state?: NullableStringFieldUpdateOperationsInput | string | null
    zip_code?: NullableStringFieldUpdateOperationsInput | string | null
    service_types?: SupplierUpdateservice_typesInput | string[]
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceDocumentUpsertWithWhereUniqueWithoutMaintenanceInput = {
    where: MaintenanceDocumentWhereUniqueInput
    update: XOR<MaintenanceDocumentUpdateWithoutMaintenanceInput, MaintenanceDocumentUncheckedUpdateWithoutMaintenanceInput>
    create: XOR<MaintenanceDocumentCreateWithoutMaintenanceInput, MaintenanceDocumentUncheckedCreateWithoutMaintenanceInput>
  }

  export type MaintenanceDocumentUpdateWithWhereUniqueWithoutMaintenanceInput = {
    where: MaintenanceDocumentWhereUniqueInput
    data: XOR<MaintenanceDocumentUpdateWithoutMaintenanceInput, MaintenanceDocumentUncheckedUpdateWithoutMaintenanceInput>
  }

  export type MaintenanceDocumentUpdateManyWithWhereWithoutMaintenanceInput = {
    where: MaintenanceDocumentScalarWhereInput
    data: XOR<MaintenanceDocumentUpdateManyMutationInput, MaintenanceDocumentUncheckedUpdateManyWithoutMaintenanceInput>
  }

  export type MaintenanceDocumentScalarWhereInput = {
    AND?: MaintenanceDocumentScalarWhereInput | MaintenanceDocumentScalarWhereInput[]
    OR?: MaintenanceDocumentScalarWhereInput[]
    NOT?: MaintenanceDocumentScalarWhereInput | MaintenanceDocumentScalarWhereInput[]
    id?: StringFilter<"MaintenanceDocument"> | string
    filename?: StringFilter<"MaintenanceDocument"> | string
    original_name?: StringFilter<"MaintenanceDocument"> | string
    file_path?: StringFilter<"MaintenanceDocument"> | string
    file_size?: IntFilter<"MaintenanceDocument"> | number
    mime_type?: StringFilter<"MaintenanceDocument"> | string
    description?: StringNullableFilter<"MaintenanceDocument"> | string | null
    created_at?: DateTimeFilter<"MaintenanceDocument"> | Date | string
    maintenanceId?: StringNullableFilter<"MaintenanceDocument"> | string | null
  }

  export type MaintenanceCreateWithoutDocumentsInput = {
    id?: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
    asset: AssetCreateNestedOneWithoutMaintenanceInput
    supplier: SupplierCreateNestedOneWithoutMaintenanceInput
  }

  export type MaintenanceUncheckedCreateWithoutDocumentsInput = {
    id?: string
    assetId: string
    supplierId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type MaintenanceCreateOrConnectWithoutDocumentsInput = {
    where: MaintenanceWhereUniqueInput
    create: XOR<MaintenanceCreateWithoutDocumentsInput, MaintenanceUncheckedCreateWithoutDocumentsInput>
  }

  export type MaintenanceUpsertWithoutDocumentsInput = {
    update: XOR<MaintenanceUpdateWithoutDocumentsInput, MaintenanceUncheckedUpdateWithoutDocumentsInput>
    create: XOR<MaintenanceCreateWithoutDocumentsInput, MaintenanceUncheckedCreateWithoutDocumentsInput>
    where?: MaintenanceWhereInput
  }

  export type MaintenanceUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: MaintenanceWhereInput
    data: XOR<MaintenanceUpdateWithoutDocumentsInput, MaintenanceUncheckedUpdateWithoutDocumentsInput>
  }

  export type MaintenanceUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    asset?: AssetUpdateOneRequiredWithoutMaintenanceNestedInput
    supplier?: SupplierUpdateOneRequiredWithoutMaintenanceNestedInput
  }

  export type MaintenanceUncheckedUpdateWithoutDocumentsInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type AssetCreateManyAssetCategoryInput = {
    id?: string
    brand: string
    model: string
    year?: number | null
    plate?: string | null
    serial_number?: string | null
    ownership?: $Enums.AssetOwnership
    documentsUrl?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type AssetUpdateWithoutAssetCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    Maintenance?: MaintenanceUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateWithoutAssetCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    Maintenance?: MaintenanceUncheckedUpdateManyWithoutAssetNestedInput
  }

  export type AssetUncheckedUpdateManyWithoutAssetCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    brand?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: NullableIntFieldUpdateOperationsInput | number | null
    plate?: NullableStringFieldUpdateOperationsInput | string | null
    serial_number?: NullableStringFieldUpdateOperationsInput | string | null
    ownership?: EnumAssetOwnershipFieldUpdateOperationsInput | $Enums.AssetOwnership
    documentsUrl?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceCreateManyAssetInput = {
    id?: string
    supplierId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type MaintenanceUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    supplier?: SupplierUpdateOneRequiredWithoutMaintenanceNestedInput
    documents?: MaintenanceDocumentUpdateManyWithoutMaintenanceNestedInput
  }

  export type MaintenanceUncheckedUpdateWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    documents?: MaintenanceDocumentUncheckedUpdateManyWithoutMaintenanceNestedInput
  }

  export type MaintenanceUncheckedUpdateManyWithoutAssetInput = {
    id?: StringFieldUpdateOperationsInput | string
    supplierId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceCreateManySupplierInput = {
    id?: string
    assetId: string
    type: $Enums.MaintenanceType
    description: string
    scheduled_date: Date | string
    started_date?: Date | string | null
    completed_date?: Date | string | null
    estimated_cost?: Decimal | DecimalJsLike | number | string | null
    actual_cost?: Decimal | DecimalJsLike | number | string | null
    status?: $Enums.MaintenanceStatus
    notes?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    is_Active?: boolean
  }

  export type MaintenanceUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    asset?: AssetUpdateOneRequiredWithoutMaintenanceNestedInput
    documents?: MaintenanceDocumentUpdateManyWithoutMaintenanceNestedInput
  }

  export type MaintenanceUncheckedUpdateWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
    documents?: MaintenanceDocumentUncheckedUpdateManyWithoutMaintenanceNestedInput
  }

  export type MaintenanceUncheckedUpdateManyWithoutSupplierInput = {
    id?: StringFieldUpdateOperationsInput | string
    assetId?: StringFieldUpdateOperationsInput | string
    type?: EnumMaintenanceTypeFieldUpdateOperationsInput | $Enums.MaintenanceType
    description?: StringFieldUpdateOperationsInput | string
    scheduled_date?: DateTimeFieldUpdateOperationsInput | Date | string
    started_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimated_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    actual_cost?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    status?: EnumMaintenanceStatusFieldUpdateOperationsInput | $Enums.MaintenanceStatus
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    is_Active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type MaintenanceDocumentCreateManyMaintenanceInput = {
    id?: string
    filename: string
    original_name: string
    file_path: string
    file_size: number
    mime_type: string
    description?: string | null
    created_at?: Date | string
  }

  export type MaintenanceDocumentUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceDocumentUncheckedUpdateWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MaintenanceDocumentUncheckedUpdateManyWithoutMaintenanceInput = {
    id?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    original_name?: StringFieldUpdateOperationsInput | string
    file_path?: StringFieldUpdateOperationsInput | string
    file_size?: IntFieldUpdateOperationsInput | number
    mime_type?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}