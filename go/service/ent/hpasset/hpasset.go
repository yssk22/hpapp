// Code generated by ent, DO NOT EDIT.

package hpasset

import (
	"fmt"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/99designs/gqlgen/graphql"
	"github.com/yssk22/hpapp/go/service/schema/enums"
)

const (
	// Label holds the string label denoting the hpasset type in the database.
	Label = "hp_asset"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldKey holds the string denoting the key field in the database.
	FieldKey = "key"
	// FieldAssetType holds the string denoting the asset_type field in the database.
	FieldAssetType = "asset_type"
	// EdgeArtist holds the string denoting the artist edge name in mutations.
	EdgeArtist = "artist"
	// EdgeMembers holds the string denoting the members edge name in mutations.
	EdgeMembers = "members"
	// EdgeAmebloPosts holds the string denoting the ameblo_posts edge name in mutations.
	EdgeAmebloPosts = "ameblo_posts"
	// EdgeIgPosts holds the string denoting the ig_posts edge name in mutations.
	EdgeIgPosts = "ig_posts"
	// Table holds the table name of the hpasset in the database.
	Table = "hp_assets"
	// ArtistTable is the table that holds the artist relation/edge.
	ArtistTable = "hp_assets"
	// ArtistInverseTable is the table name for the HPArtist entity.
	// It exists in this package in order to avoid circular dependency with the "hpartist" package.
	ArtistInverseTable = "hp_artists"
	// ArtistColumn is the table column denoting the artist relation/edge.
	ArtistColumn = "hp_artist_assets"
	// MembersTable is the table that holds the members relation/edge. The primary key declared below.
	MembersTable = "hp_member_assets"
	// MembersInverseTable is the table name for the HPMember entity.
	// It exists in this package in order to avoid circular dependency with the "hpmember" package.
	MembersInverseTable = "hp_members"
	// AmebloPostsTable is the table that holds the ameblo_posts relation/edge.
	AmebloPostsTable = "hp_ameblo_posts"
	// AmebloPostsInverseTable is the table name for the HPAmebloPost entity.
	// It exists in this package in order to avoid circular dependency with the "hpameblopost" package.
	AmebloPostsInverseTable = "hp_ameblo_posts"
	// AmebloPostsColumn is the table column denoting the ameblo_posts relation/edge.
	AmebloPostsColumn = "hp_asset_ameblo_posts"
	// IgPostsTable is the table that holds the ig_posts relation/edge.
	IgPostsTable = "hp_ig_posts"
	// IgPostsInverseTable is the table name for the HPIgPost entity.
	// It exists in this package in order to avoid circular dependency with the "hpigpost" package.
	IgPostsInverseTable = "hp_ig_posts"
	// IgPostsColumn is the table column denoting the ig_posts relation/edge.
	IgPostsColumn = "hp_asset_ig_posts"
)

// Columns holds all SQL columns for hpasset fields.
var Columns = []string{
	FieldID,
	FieldKey,
	FieldAssetType,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "hp_assets"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"hp_artist_assets",
}

var (
	// MembersPrimaryKey and MembersColumn2 are the table columns denoting the
	// primary key for the members relation (M2M).
	MembersPrimaryKey = []string{"hp_member_id", "hp_asset_id"}
)

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

// AssetTypeValidator is a validator for the "asset_type" field enum values. It is called by the builders before save.
func AssetTypeValidator(at enums.HPAssetType) error {
	switch at {
	case "ameblo", "elineupmall", "instagram", "tiktok", "twitter", "youtube":
		return nil
	default:
		return fmt.Errorf("hpasset: invalid enum value for asset_type field: %q", at)
	}
}

// Order defines the ordering method for the HPAsset queries.
type Order func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByKey orders the results by the key field.
func ByKey(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldKey, opts...).ToFunc()
}

// ByAssetType orders the results by the asset_type field.
func ByAssetType(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldAssetType, opts...).ToFunc()
}

// ByArtistField orders the results by artist field.
func ByArtistField(field string, opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newArtistStep(), sql.OrderByField(field, opts...))
	}
}

// ByMembersCount orders the results by members count.
func ByMembersCount(opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newMembersStep(), opts...)
	}
}

// ByMembers orders the results by members terms.
func ByMembers(term sql.OrderTerm, terms ...sql.OrderTerm) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newMembersStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByAmebloPostsCount orders the results by ameblo_posts count.
func ByAmebloPostsCount(opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newAmebloPostsStep(), opts...)
	}
}

// ByAmebloPosts orders the results by ameblo_posts terms.
func ByAmebloPosts(term sql.OrderTerm, terms ...sql.OrderTerm) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newAmebloPostsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByIgPostsCount orders the results by ig_posts count.
func ByIgPostsCount(opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newIgPostsStep(), opts...)
	}
}

// ByIgPosts orders the results by ig_posts terms.
func ByIgPosts(term sql.OrderTerm, terms ...sql.OrderTerm) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newIgPostsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}
func newArtistStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(ArtistInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, ArtistTable, ArtistColumn),
	)
}
func newMembersStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(MembersInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, MembersTable, MembersPrimaryKey...),
	)
}
func newAmebloPostsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(AmebloPostsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, AmebloPostsTable, AmebloPostsColumn),
	)
}
func newIgPostsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(IgPostsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, IgPostsTable, IgPostsColumn),
	)
}

var (
	// enums.HPAssetType must implement graphql.Marshaler.
	_ graphql.Marshaler = (*enums.HPAssetType)(nil)
	// enums.HPAssetType must implement graphql.Unmarshaler.
	_ graphql.Unmarshaler = (*enums.HPAssetType)(nil)
)
