

// direction: forward, backward, both
const graph = {
  nodes: [
    {
      id: 1
      text: 'first I do this',
    },
    {
      id: 2,
      text: 'then I do this',
    },
    {
      id: 3,
      text: 'hmm dis happens',
    },
    {
      id: 4,
      text: 'sumtimes dis',
    },
  ],
  edges: [
    { id: 1, nodes: [1, 2], direction: 'forward' },
    { id: 2, nodes: [1, 3], direction: 'forward' },
    { id: 3, nodes: [3, 4], direction: 'forward' },
  ]
}

// rank
// break cycles by reversing edges
// ordering
// position
// make splines

// render

/*
	psuedo code

	procedure draw_graph()
		rank();
		ordering();
		position();
		make_splines();
	end

	procedure rank()
		feasible_tree();
		while (e = leave_edge()) ≠ nil do
			f = enter_edge(e);
			exchange(e,f);
		end
		normalize();
		balance();
end


procedure feasible_tree()
 init_rank();
 while tight_tree() <  V do
 e = a non-tree edge incident on the tree
 with a minimal amount of slack;
 delta = slack(e);
 if incident node is e.head then delta = -delta;
 for v in Tree do v.rank = v.rank + delta;
 end
 init_cutvalues();
 end
 */
