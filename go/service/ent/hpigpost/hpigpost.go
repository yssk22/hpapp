// Code generated by ent, DO NOT EDIT.

package hpigpost

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

const (
	// Label holds the string label denoting the hpigpost type in the database.
	Label = "hp_ig_post"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCrawledAt holds the string denoting the crawled_at field in the database.
	FieldCrawledAt = "crawled_at"
	// FieldErrorCount holds the string denoting the error_count field in the database.
	FieldErrorCount = "error_count"
	// FieldManuallyModified holds the string denoting the manually_modified field in the database.
	FieldManuallyModified = "manually_modified"
	// FieldLastErrorMessage holds the string denoting the last_error_message field in the database.
	FieldLastErrorMessage = "last_error_message"
	// FieldRecrawlRequired holds the string denoting the recrawl_required field in the database.
	FieldRecrawlRequired = "recrawl_required"
	// FieldCreatedAt holds the string denoting the created_at field in the database.
	FieldCreatedAt = "created_at"
	// FieldUpdatedAt holds the string denoting the updated_at field in the database.
	FieldUpdatedAt = "updated_at"
	// FieldShortcode holds the string denoting the shortcode field in the database.
	FieldShortcode = "shortcode"
	// FieldDescription holds the string denoting the description field in the database.
	FieldDescription = "description"
	// FieldPostAt holds the string denoting the post_at field in the database.
	FieldPostAt = "post_at"
	// FieldMedia holds the string denoting the media field in the database.
	FieldMedia = "media"
	// FieldLikes holds the string denoting the likes field in the database.
	FieldLikes = "likes"
	// FieldComments holds the string denoting the comments field in the database.
	FieldComments = "comments"
	// FieldRecrawlArgs holds the string denoting the recrawl_args field in the database.
	FieldRecrawlArgs = "recrawl_args"
	// FieldOwnerArtistID holds the string denoting the owner_artist_id field in the database.
	FieldOwnerArtistID = "hp_artist_ig_posts"
	// FieldOwnerMemberID holds the string denoting the owner_member_id field in the database.
	FieldOwnerMemberID = "hp_member_ig_posts"
	// EdgeOwnerArtist holds the string denoting the owner_artist edge name in mutations.
	EdgeOwnerArtist = "owner_artist"
	// EdgeOwnerMember holds the string denoting the owner_member edge name in mutations.
	EdgeOwnerMember = "owner_member"
	// EdgeAsset holds the string denoting the asset edge name in mutations.
	EdgeAsset = "asset"
	// EdgeTaggedArtists holds the string denoting the tagged_artists edge name in mutations.
	EdgeTaggedArtists = "tagged_artists"
	// EdgeTaggedMembers holds the string denoting the tagged_members edge name in mutations.
	EdgeTaggedMembers = "tagged_members"
	// EdgeBlobs holds the string denoting the blobs edge name in mutations.
	EdgeBlobs = "blobs"
	// Table holds the table name of the hpigpost in the database.
	Table = "hp_ig_posts"
	// OwnerArtistTable is the table that holds the owner_artist relation/edge.
	OwnerArtistTable = "hp_ig_posts"
	// OwnerArtistInverseTable is the table name for the HPArtist entity.
	// It exists in this package in order to avoid circular dependency with the "hpartist" package.
	OwnerArtistInverseTable = "hp_artists"
	// OwnerArtistColumn is the table column denoting the owner_artist relation/edge.
	OwnerArtistColumn = "hp_artist_ig_posts"
	// OwnerMemberTable is the table that holds the owner_member relation/edge.
	OwnerMemberTable = "hp_ig_posts"
	// OwnerMemberInverseTable is the table name for the HPMember entity.
	// It exists in this package in order to avoid circular dependency with the "hpmember" package.
	OwnerMemberInverseTable = "hp_members"
	// OwnerMemberColumn is the table column denoting the owner_member relation/edge.
	OwnerMemberColumn = "hp_member_ig_posts"
	// AssetTable is the table that holds the asset relation/edge.
	AssetTable = "hp_ig_posts"
	// AssetInverseTable is the table name for the HPAsset entity.
	// It exists in this package in order to avoid circular dependency with the "hpasset" package.
	AssetInverseTable = "hp_assets"
	// AssetColumn is the table column denoting the asset relation/edge.
	AssetColumn = "hp_asset_ig_posts"
	// TaggedArtistsTable is the table that holds the tagged_artists relation/edge. The primary key declared below.
	TaggedArtistsTable = "hp_artist_tagged_ig_posts"
	// TaggedArtistsInverseTable is the table name for the HPArtist entity.
	// It exists in this package in order to avoid circular dependency with the "hpartist" package.
	TaggedArtistsInverseTable = "hp_artists"
	// TaggedMembersTable is the table that holds the tagged_members relation/edge. The primary key declared below.
	TaggedMembersTable = "hp_member_tagged_ig_posts"
	// TaggedMembersInverseTable is the table name for the HPMember entity.
	// It exists in this package in order to avoid circular dependency with the "hpmember" package.
	TaggedMembersInverseTable = "hp_members"
	// BlobsTable is the table that holds the blobs relation/edge. The primary key declared below.
	BlobsTable = "hp_ig_post_blobs"
	// BlobsInverseTable is the table name for the HPBlob entity.
	// It exists in this package in order to avoid circular dependency with the "hpblob" package.
	BlobsInverseTable = "hp_blobs"
)

// Columns holds all SQL columns for hpigpost fields.
var Columns = []string{
	FieldID,
	FieldCrawledAt,
	FieldErrorCount,
	FieldManuallyModified,
	FieldLastErrorMessage,
	FieldRecrawlRequired,
	FieldCreatedAt,
	FieldUpdatedAt,
	FieldShortcode,
	FieldDescription,
	FieldPostAt,
	FieldMedia,
	FieldLikes,
	FieldComments,
	FieldRecrawlArgs,
	FieldOwnerArtistID,
	FieldOwnerMemberID,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "hp_ig_posts"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"hp_asset_ig_posts",
}

var (
	// TaggedArtistsPrimaryKey and TaggedArtistsColumn2 are the table columns denoting the
	// primary key for the tagged_artists relation (M2M).
	TaggedArtistsPrimaryKey = []string{"hp_artist_id", "hp_ig_post_id"}
	// TaggedMembersPrimaryKey and TaggedMembersColumn2 are the table columns denoting the
	// primary key for the tagged_members relation (M2M).
	TaggedMembersPrimaryKey = []string{"hp_member_id", "hp_ig_post_id"}
	// BlobsPrimaryKey and BlobsColumn2 are the table columns denoting the
	// primary key for the blobs relation (M2M).
	BlobsPrimaryKey = []string{"hp_ig_post_id", "hp_blob_id"}
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

// Note that the variables below are initialized by the runtime
// package on the initialization of the application. Therefore,
// it should be imported in the main as follows:
//
//	import _ "github.com/yssk22/hpapp/go/service/ent/runtime"
var (
	Hooks [1]ent.Hook
	// DefaultErrorCount holds the default value on creation for the "error_count" field.
	DefaultErrorCount int
	// DefaultRecrawlRequired holds the default value on creation for the "recrawl_required" field.
	DefaultRecrawlRequired bool
)

// Order defines the ordering method for the HPIgPost queries.
type Order func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByCrawledAt orders the results by the crawled_at field.
func ByCrawledAt(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldCrawledAt, opts...).ToFunc()
}

// ByErrorCount orders the results by the error_count field.
func ByErrorCount(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldErrorCount, opts...).ToFunc()
}

// ByLastErrorMessage orders the results by the last_error_message field.
func ByLastErrorMessage(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldLastErrorMessage, opts...).ToFunc()
}

// ByRecrawlRequired orders the results by the recrawl_required field.
func ByRecrawlRequired(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldRecrawlRequired, opts...).ToFunc()
}

// ByCreatedAt orders the results by the created_at field.
func ByCreatedAt(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldCreatedAt, opts...).ToFunc()
}

// ByUpdatedAt orders the results by the updated_at field.
func ByUpdatedAt(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldUpdatedAt, opts...).ToFunc()
}

// ByShortcode orders the results by the shortcode field.
func ByShortcode(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldShortcode, opts...).ToFunc()
}

// ByDescription orders the results by the description field.
func ByDescription(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldDescription, opts...).ToFunc()
}

// ByPostAt orders the results by the post_at field.
func ByPostAt(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldPostAt, opts...).ToFunc()
}

// ByLikes orders the results by the likes field.
func ByLikes(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldLikes, opts...).ToFunc()
}

// ByComments orders the results by the comments field.
func ByComments(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldComments, opts...).ToFunc()
}

// ByOwnerArtistID orders the results by the owner_artist_id field.
func ByOwnerArtistID(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldOwnerArtistID, opts...).ToFunc()
}

// ByOwnerMemberID orders the results by the owner_member_id field.
func ByOwnerMemberID(opts ...sql.OrderTermOption) Order {
	return sql.OrderByField(FieldOwnerMemberID, opts...).ToFunc()
}

// ByOwnerArtistField orders the results by owner_artist field.
func ByOwnerArtistField(field string, opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newOwnerArtistStep(), sql.OrderByField(field, opts...))
	}
}

// ByOwnerMemberField orders the results by owner_member field.
func ByOwnerMemberField(field string, opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newOwnerMemberStep(), sql.OrderByField(field, opts...))
	}
}

// ByAssetField orders the results by asset field.
func ByAssetField(field string, opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newAssetStep(), sql.OrderByField(field, opts...))
	}
}

// ByTaggedArtistsCount orders the results by tagged_artists count.
func ByTaggedArtistsCount(opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newTaggedArtistsStep(), opts...)
	}
}

// ByTaggedArtists orders the results by tagged_artists terms.
func ByTaggedArtists(term sql.OrderTerm, terms ...sql.OrderTerm) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newTaggedArtistsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByTaggedMembersCount orders the results by tagged_members count.
func ByTaggedMembersCount(opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newTaggedMembersStep(), opts...)
	}
}

// ByTaggedMembers orders the results by tagged_members terms.
func ByTaggedMembers(term sql.OrderTerm, terms ...sql.OrderTerm) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newTaggedMembersStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByBlobsCount orders the results by blobs count.
func ByBlobsCount(opts ...sql.OrderTermOption) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newBlobsStep(), opts...)
	}
}

// ByBlobs orders the results by blobs terms.
func ByBlobs(term sql.OrderTerm, terms ...sql.OrderTerm) Order {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newBlobsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}
func newOwnerArtistStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(OwnerArtistInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, OwnerArtistTable, OwnerArtistColumn),
	)
}
func newOwnerMemberStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(OwnerMemberInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, OwnerMemberTable, OwnerMemberColumn),
	)
}
func newAssetStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(AssetInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, AssetTable, AssetColumn),
	)
}
func newTaggedArtistsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(TaggedArtistsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, TaggedArtistsTable, TaggedArtistsPrimaryKey...),
	)
}
func newTaggedMembersStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(TaggedMembersInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, TaggedMembersTable, TaggedMembersPrimaryKey...),
	)
}
func newBlobsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(BlobsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, false, BlobsTable, BlobsPrimaryKey...),
	)
}
