import { HPArtist, useHelloProject } from "@hpapp/contexts/serviceroot";
import ArtistCard from "@hpapp/features/artist/ArtistCard";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

export default function ByGroupView() {
  const hp = useHelloProject();
  const artists = hp.useArtists(false);
  return (
    <FlatList
      data={artists}
      keyExtractor={(a) => a.id}
      renderItem={(item) => {
        return <ArtistCard artist={item.item} />;
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
